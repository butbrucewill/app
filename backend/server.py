from dotenv import load_dotenv

load_dotenv()

import asyncio
import csv
import io
import ipaddress
import logging
import os
import re
import uuid
from datetime import datetime, timedelta, timezone
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse

import bcrypt
import httpx
import jwt
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware
from bson.binary import Binary
from fastapi import File, UploadFile

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Trading Ke Khiladi")
ORGANIZER_EMAIL = os.environ.get("ORGANIZER_EMAIL")


# ---------------- Email guardrail gate (managed Resend playbook) ----------------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    async with httpx.AsyncClient(timeout=30) as client_http:
        resp = await client_http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


async def notify_organizer(app_doc: dict) -> None:
    if not (EMAIL_KEY and ORGANIZER_EMAIL):
        logger.warning("Email not configured; skipping organizer notification")
        return
    try:
        rows = "".join(
            f'<tr><td style="padding:8px 12px;color:#999;font-size:13px">{label}</td>'
            f'<td style="padding:8px 12px;color:#fff;font-size:13px"><strong>{escape(str(value))}</strong></td></tr>'
            for label, value in [
                ("Name", app_doc["full_name"]),
                ("Phone", app_doc["phone"]),
                ("Email", app_doc["email"]),
                ("City", app_doc["city"]),
                ("Date of Birth", app_doc["dob"]),
                ("Trading Experience", app_doc["trading_experience"]),
                ("Applied At", app_doc["created_at"]),
            ]
        )
        html = (
            '<table role="presentation" width="100%" style="background:#0A0A0A;padding:24px">'
            '<tr><td style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#141414;'
            'border:1px solid #2a2a2a;padding:24px">'
            f'<p style="color:#FF3333;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Trading Ke Khiladi</p>'
            f'<h1 style="color:#fff;font-size:20px;margin:0 0 16px">New application received</h1>'
            f'<table role="presentation" width="100%" style="border-top:1px solid #2a2a2a">{rows}</table>'
            f'<p style="font-size:12px;color:#888;margin-top:20px">Sent by {escape(EMAIL_FROM_NAME)}. '
            "View all applications in your admin dashboard.</p>"
            "</td></tr></table>"
        )
        await send_email(
            to=ORGANIZER_EMAIL,
            subject=f"New application: {app_doc['full_name']}",
            html=html,
        )
        logger.info("Organizer notified for application %s", app_doc["id"])
    except Exception:
        logger.exception("Failed to send organizer notification")


# ---------------- Auth ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"email": payload["email"]}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Not authorized")
    return user


# ---------------- Models ----------------
class ApplicationCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=8, max_length=20)
    email: EmailStr
    city: str = Field(min_length=2, max_length=80)
    dob: str = Field(min_length=4, max_length=20)
    trading_experience: str = Field(min_length=2, max_length=60)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


# ---------------- Public routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Trading Ke Khiladi API"}


@api_router.post("/applications", status_code=201)
async def create_application(input: ApplicationCreate):
    try:
        dob = datetime.strptime(input.dob, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date of birth")
    age = (datetime.now() - dob).days // 365
    if age < 18:
        raise HTTPException(status_code=400, detail="You must be 18 or older to apply")

    email = input.email.lower()
    existing = await db.applications.find_one(
        {"$or": [{"email": email}, {"phone": input.phone}]}, {"_id": 0, "id": 1}
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail="An application with this email or phone number already exists.",
        )

    doc = {
        "id": str(uuid.uuid4()),
        "full_name": input.full_name.strip(),
        "phone": input.phone.strip(),
        "email": email,
        "city": input.city.strip(),
        "dob": input.dob,
        "trading_experience": input.trading_experience,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.applications.insert_one({**doc})
    asyncio.create_task(notify_organizer(doc))
    return {"status": "success", "id": doc["id"]}


# ---------------- Auth routes ----------------
@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("count", 0) >= 5:
        locked_until = attempts.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {
                "$inc": {"count": 1},
                "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()},
            },
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(str(user["_id"]), email)
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=True,
        samesite="none", max_age=43200, path="/",
    )
    return {"email": email, "role": "admin", "name": user.get("name", "Admin"), "token": token}


@api_router.get("/auth/me")
async def auth_me(admin=Depends(get_current_admin)):
    return admin


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"status": "logged_out"}


# ---------------- Admin routes ----------------
@api_router.get("/admin/applications")
async def list_applications(search: str = "", admin=Depends(get_current_admin)):
    query = {}
    if search.strip():
        rx = {"$regex": re.escape(search.strip()), "$options": "i"}
        query = {"$or": [{"full_name": rx}, {"email": rx}, {"phone": rx}, {"city": rx}]}
    apps = await db.applications.find(query, {"_id": 0}).sort("created_at", -1).to_list(10000)
    total = await db.applications.count_documents({})
    return {"applications": apps, "total": total}


@api_router.get("/admin/applications/export")
async def export_applications(admin=Depends(get_current_admin)):
    apps = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["ID", "Full Name", "Phone", "Email", "City", "Date of Birth", "Trading Experience", "Status", "Applied At"])
    for a in apps:
        writer.writerow([
            a.get("id"), a.get("full_name"), a.get("phone"), a.get("email"), a.get("city"),
            a.get("dob"), a.get("trading_experience"), a.get("status"), a.get("created_at"),
        ])
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=tkk_applications.csv"},
    )


# ---------------- Game scores ----------------
class GameScoreInput(BaseModel):
    player_key: str = Field(min_length=1, max_length=64)
    player_name: str = Field(default="Guest Khiladi", max_length=120)
    player_email: str = Field(default="", max_length=120)
    rounds: int = 0
    wins: int = 0
    balance: float = 1000
    best_streak: int = 0


@api_router.post("/game/score")
async def save_game_score(input: GameScoreInput):
    doc = input.model_dump()
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.game_scores.update_one({"player_key": input.player_key}, {"$set": doc}, upsert=True)
    return {"status": "saved"}


@api_router.get("/admin/game-scores")
async def list_game_scores(admin=Depends(get_current_admin)):
    scores = await db.game_scores.find({}, {"_id": 0}).sort([("best_streak", -1), ("balance", -1)]).to_list(2000)
    return {"scores": scores, "total": len(scores)}


_IMG_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_MAX_UPLOAD = 5 * 1024 * 1024  # 5 MB
 
 
def _slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")[:90]
 
 
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
 
 
class FaqItem(BaseModel):
    model_config = {"extra": "ignore"}
 
    question: str = Field(default="", max_length=300)
    answer: str = Field(default="", max_length=3000)
 
 

class BlogInput(BaseModel):
    model_config = {"extra": "ignore"}
 
    title: str = Field(min_length=3, max_length=200)
    h1: str = ""
    slug: str = ""
    excerpt: str = Field(default="", max_length=400)
    category: str = ""
    tags: str = ""
    author: str = "Trading Ke Khiladi"
    published_at: str = ""
    cover_image: str = ""
    cover_alt: str = ""
    meta_title: str = ""
    meta_description: str = ""
    focus_keyword: str = ""
    secondary_keywords: str = ""
    canonical_url: str = ""
    index_status: str = "index"
    schema_type: str = "BlogPosting"
    og_title: str = ""
    og_description: str = ""
    og_image: str = ""
    content: str = ""
    faqs: list[FaqItem] = Field(default_factory=list, max_length=30)
    status: str = "draft"  # draft | published
 
 
class BlogOrderInput(BaseModel):
    ids: list[str]
 
 
async def _ensure_unique_slug(slug: str, exclude_id: str | None = None) -> None:
    query = {"slug": slug}
    if exclude_id:
        query["blog_id"] = {"$ne": exclude_id}
    if await db.blogs.find_one(query, {"_id": 1}):
        raise HTTPException(status_code=409, detail="This URL slug is already used by another blog.")
 
def _clean_faqs(faqs: list[dict]) -> list[dict]:
    """Keep only FAQs that have both a question and an answer."""
    return [
        {"question": f["question"].strip(), "answer": f["answer"].strip()}
        for f in (faqs or [])
        if f.get("question", "").strip() and f.get("answer", "").strip()
    ]
 

# ----- public -----
@api_router.get("/blogs")
async def public_list_blogs():
    blogs = await (
        db.blogs.find({"status": "published"}, {"_id": 0, "content": 0})
        .sort([("sort_order", 1), ("published_at", -1)])
        .to_list(500)
    )
    return {"blogs": blogs}
 
 
@api_router.get("/blogs/{slug}")
async def public_get_blog(slug: str):
    blog = await db.blogs.find_one({"slug": slug, "status": "published"}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"blog": blog}
 
 
@api_router.get("/uploads/{file_id}")
async def get_upload(file_id: str):
    doc = await db.uploads.find_one({"file_id": file_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(
        content=bytes(doc["data"]),
        media_type=doc["content_type"],
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
 
 
# ----- admin -----
@api_router.get("/admin/blogs")
async def admin_list_blogs(admin=Depends(get_current_admin)):
    blogs = await (
        db.blogs.find({}, {"_id": 0, "content": 0})
        .sort([("sort_order", 1), ("created_at", -1)])
        .to_list(1000)
    )
    return {"blogs": blogs}
 
 
@api_router.get("/admin/blogs/{blog_id}")
async def admin_get_blog(blog_id: str, admin=Depends(get_current_admin)):
    blog = await db.blogs.find_one({"blog_id": blog_id}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"blog": blog}
 
 
@api_router.post("/admin/blogs", status_code=201)
async def admin_create_blog(input: BlogInput, admin=Depends(get_current_admin)):
    data = input.model_dump()
    data["slug"] = _slugify(data["slug"] or data["title"]) or uuid.uuid4().hex[:8]
    await _ensure_unique_slug(data["slug"])
 
    now = _now_iso()
    first = await db.blogs.find_one({}, {"_id": 0, "sort_order": 1}, sort=[("sort_order", 1)])
    data.update(
        blog_id=str(uuid.uuid4()),
        created_at=now,
        updated_at=now,
        published_at=data["published_at"] or now[:10],
        sort_order=(first.get("sort_order", 0) - 1) if first else 0,  # new posts start at #1
    )
    await db.blogs.insert_one({**data})
    return {"blog": data}
 
 
@api_router.put("/admin/blogs/{blog_id}")
async def admin_update_blog(blog_id: str, input: BlogInput, admin=Depends(get_current_admin)):
    existing = await db.blogs.find_one({"blog_id": blog_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog not found")
 
    data = input.model_dump()
    data["slug"] = _slugify(data["slug"] or data["title"]) or existing["slug"]
    await _ensure_unique_slug(data["slug"], exclude_id=blog_id)
    data["published_at"] = data["published_at"] or existing.get("published_at") or existing["created_at"][:10]
    data["updated_at"] = _now_iso()
 
    await db.blogs.update_one({"blog_id": blog_id}, {"$set": data})
    return {"blog": {**existing, **data}}
 
 
@api_router.delete("/admin/blogs/{blog_id}")
async def admin_delete_blog(blog_id: str, admin=Depends(get_current_admin)):
    res = await db.blogs.delete_one({"blog_id": blog_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"status": "deleted"}
 
 
@api_router.put("/admin/blogs-order")
async def admin_reorder_blogs(input: BlogOrderInput, admin=Depends(get_current_admin)):
    for index, blog_id in enumerate(input.ids):
        await db.blogs.update_one({"blog_id": blog_id}, {"$set": {"sort_order": index}})
    return {"status": "ok"}
 
 
@api_router.post("/admin/upload")
async def admin_upload_image(file: UploadFile = File(...), admin=Depends(get_current_admin)):
    if file.content_type not in _IMG_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP or GIF images are allowed")
    raw = await file.read()
    if len(raw) > _MAX_UPLOAD:
        raise HTTPException(status_code=400, detail="Image must be under 5 MB")
    file_id = uuid.uuid4().hex
    await db.uploads.insert_one({
        "file_id": file_id,
        "content_type": file.content_type,
        "data": Binary(raw),
        "created_at": _now_iso(),
    })
    return {"url": f"/api/uploads/{file_id}"}
 

# ---------------- Startup ----------------
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.applications.create_index("email")
    await db.applications.create_index("created_at")
    await db.game_scores.create_index("player_key", unique=True)
    await db.blogs.create_index("slug", unique=True)
    await db.blogs.create_index("blog_id", unique=True)
    await db.blogs.create_index([("status", 1), ("sort_order", 1)])
    await db.uploads.create_index("file_id", unique=True)


    admin_email = os.environ.get("ADMIN_EMAIL", "").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_password:
        existing = await db.users.find_one({"email": admin_email})
        if existing is None:
            await db.users.insert_one({
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "Organizer Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info("Admin seeded: %s", admin_email)
        elif not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}}
            )
            logger.info("Admin password updated: %s", admin_email)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
