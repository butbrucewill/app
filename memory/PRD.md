# Trading Ke Khiladi — PRD

## Original problem statement
A dark, high-energy, high-conversion marketing landing site for the "Trading Ke Khiladi" event — a 6-day simulated (paper) trading reality show in a Thailand villa resort — with immediate application capture, organizer admin access, CSV export, and email alerts. No payments in phase 1. Locked facts: 40 participants, 4 teams of 10, 6 days, Thailand villa resort, ₹3L registration, free Buniyad course, ₹30L prize pool, simulated/paper trading format. Mobile-first; traffic from Instagram/WhatsApp.

## User personas
- Applicants/participants: aspiring traders arriving from social links on mobile
- Organizers/admin team: review applications, shortlist, export data
- Mentors/judges: profile entities on the site (lineup pending)

## Architecture
- Frontend: React (CRA/craco), Tailwind, framer-motion, lenis, sonner, lucide-react
- Backend: FastAPI (server.py), all routes under /api
- DB: MongoDB via motor (MONGO_URL/DB_NAME from env)
- Auth: JWT (12h) in httpOnly cookie, bcrypt password hashing, brute-force lockout (5 attempts / 15 min), admin seeded from env on startup
- Email: Emergent-managed Resend proxy (EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME) — organizer alert on each new application, non-blocking asyncio task
- Design: design_guidelines.json — Deep Obsidian #0A0A0A, Electric Red #FF3333, Oswald headings, Manrope body

## Core requirements (static)
1. One-page landing: hero + countdown + Apply CTA, story, journey, challenges, mentors, villa, prizes + Buniyad, apply form, footer legal
2. Short application form: name, phone, email, city, DOB, trading experience (+ consent checkbox)
3. Confirmation state after submission
4. Admin dashboard: login, applications table, search, CSV export
5. Email alert to organizer team per application
6. Legal pages: Terms, Privacy, Risk Disclosure, Refund/Cancellation
7. Simulated-trading disclosure everywhere money/prizes are mentioned
8. No payment collection in v1; no misleading outcome language

## Implemented (2026-08-20)
- All Phase 1 items above, verified end to end:
  - POST /api/applications (201, duplicate 409, under-18 400 validation)
  - Admin JWT auth (login/me/logout), seeded admin, lockout
  - GET /api/admin/applications with search; CSV export
  - Organizer email alert confirmed sending (HTTP 202 from proxy)
  - Landing page all sections + countdown + form success state (screenshot-verified)
  - 4 legal pages + footer simulated-trading disclosure
  - Countdown timer (Phase 2 item pulled in early)

### 2026-08-20 iteration 2 — real mentors + reference design match
- Swapped in 3 real uploaded mentor photos (public/assets/*.webp): Rajat Sharma (@MrSimpleTrade, Price Action · Options — details from user's own reference site), Aman (Trading Mentor), third card "Revealing Soon". Aman's photo was rotated 90° CW to fix orientation; per-card object-position crops.
- Buniyad copy corrected per user: course is bundled FREE with the ₹3,00,000 participation fee (not tied to winning/selection alone); fee card now lists inclusions.
- Restyled frontend to match user's reference site (akashnayar.in/lp-r): top stock ticker marquee (NIFTY/RELIANCE etc.), real fist logo (tkk-logo.png) in nav + hero, hero-arena.jpg background, "Season 01 · Applications Open" badge, glass cards, gradient pill CTAs with glow, Bebas Neue display font, word-rise heading animations (framer variants), animated chart-line SVG dividers, grid + red/green radial glow background, rounded-2xl/3xl glass cards throughout.
- Kept locked facts (₹30L pool, 40 participants, simulated trading) — did NOT copy reference's "₹1 Crore / real capital" claims.
- Bug fixed: RiseHeading words were invisible — IntersectionObserver never fired because words were fully clipped by overflow-hidden masks at y:110%; fixed by observing the line wrapper with variants stagger. Gradient text (background-clip:text) failed on composited animated words — accent lines now solid primary red.

### 2026-08-20 iteration 3 — third mentor + real villa photos
- Third mentor named: Rishabh Mishra (Judge & Risk Coach, Season 01 Mentor tag). Handle/specialty detail not provided — name only, no invented handle.
- Villa gallery now uses the 2 real uploaded resort photos (aerial villa view + pool deck), saved as optimized /assets/villa-1.webp and villa-2.webp. Stock villa images removed.

### 2026-08-20 iteration 4 — font visibility + branded challenges banner
- Display font changed Bebas Neue → Anton (heavier condensed; user reported headings "not visible" / too thin on dark bg).
- Challenges banner image replaced with user's branded TKK tug-of-war artwork (/assets/challenges-banner.webp). Bottom stat strip of the artwork was cropped off because it said "50+ participants / 1 champion" — conflicts with locked facts (40 participants, ₹30L pool, team format). Overlay changed from flat black/50 to bottom gradient so artwork shows through.

### 2026-08-20 iteration 5 — display font clarity
- Anton proved too dense ("glowing, not easily visible" per user). Display font now Oswald with a global .font-display rule: weight 600 + 0.03em letter-spacing for clean legibility on the dark theme. Applied globally (headings, day titles, card titles, stat numbers, countdown digits).

### 2026-08-20 iteration 6 — apply section backdrop
- Branded TKK banner artwork (challenges-banner.webp) added as dimmed backdrop (25% opacity + radial mask) behind the apply form for a stronger final conversion push. Verified readable on desktop + mobile.

### 2026-08-20 iteration 7 — full mentor details (user-provided)
- Rajat Sharma — Founding Director; builds/leads One Stock Academy's trading community; 150K+ on Instagram.
- Aman Singh Negi — Chief Academic Officer; leads online cohort experience, price action & market structure for beginners; 750K+ on Instagram.
- Rishabh Mishra — Founding Director; SEBI-registered trader, drives One Stock Academy curriculum & mentorship philosophy, leads flagship live sessions and 1:1; "SEBI Registered" tag.
- Mentor cards now show name + red title + description + follower/registration tag pill.

### 2026-08-20 iteration 8 — Hostinger deployment fix
- Diagnosis: user uploaded a frontend build to Hostinger shared hosting (tradingkekhiladi.com) built WITHOUT REACT_APP_BACKEND_URL baked in → form submissions 404'd ("Something went wrong"). Hostinger shared hosting cannot run FastAPI/MongoDB.
- Fix delivered: production build zip at /app/frontend/tkk-hostinger-upload.zip with backend URL baked in (points to Emergent backend) + public/.htaccess SPA fallback (fixes /admin, /legal/* 404s on Apache).
- Auth changed cookie-only → JWT Bearer token (login returns token; admin frontend stores in localStorage, sends Authorization header) because third-party cookies are blocked cross-site (Hostinger domain → Emergent backend). Cookie flow still supported by backend.
- Verified on the exact zipped build served statically: form submit SUCCESS, admin login SUCCESS, dashboard lists applications.

### 2026-08-26 iteration 9 — Gaming Zone page
- New /gamingzone route: embeds user's self-contained "Pattern Pit — Call It" trading-pattern game (public/gaming-zone.html) in a branded page (logo header, Back to site). Game text rebranded: title + eyebrow "Trading Ke Khiladi · Gaming Zone".
- "Gaming Zone" nav link added (red accent) on desktop + mobile.
- Fixed a user-side edit in App.js that imported GamingZone from a non-existent path (would have broken the build).

### 2026-08-26 iteration 10 — game branding + bug fixes + regression check
- User had embedded a React port of the game into the landing page (components/landing/GamingZone.jsx) with its own CSS in App.css. Fixed two game-breaking bugs: start button disabled forever after round 1 (now disabled only while a round is live), and paddles clickable after a round ended (now guarded by active state).
- Rebranded BOTH game versions to TKK theme: brass/gold → Electric Red #FF3333, chalk → white, bg → #0A0A0A, Space Grotesk → Oswald, TKK fist logo added to game headers, eyebrow "Trading Ke Khiladi · Gaming Zone". Standalone (public/gaming-zone.html) and embedded React port both updated. IBM Plex Mono added to index.html fonts.
- Removed duplicate Gaming Zone nav entry (kept the anchor).
- Verified on preview: game playable across consecutive rounds (balance updated $1,000 → $1,175.44), form submit SUCCESS, admin login SUCCESS showing 11 applications (new entry reflected instantly). Reported form/admin failures were on the live Hostinger deployment (stale build / sleeping preview backend), not the codebase.

### 2026-08-26 iteration 11 — PHP/MySQL backend for single Hostinger deployment + design elevation
- Full PHP + MySQL backend in public/api/ (ships inside React build): config.php (DB creds placeholders), db.php (PDO), setup.php (one-time table create + admin seed), applications.php (POST, 18+ check, duplicate 409), admin/ (login.php session auth, me.php, logout.php, applications.php GET+search, export.php CSV), import_csv.php (one-time CSV import from old panel). No email alerts (user choice).
- .htaccess: clean-path rewrites (/api/applications → api/applications.php etc.) + SPA fallback. Frontend API switched to same-origin "/api" — works on Emergent preview (FastAPI) AND Hostinger (PHP) with zero env vars needed. REACT_APP_BACKEND_URL no longer required.
- Design elevation: kinetic hero (logo wipe reveal via clip-path, masked line-by-line headline, scroll parallax on bg, content fade on scroll), numbered manifesto chapter badges (01–07), slow editorial marquee bands (outline text) after hero and before apply form, clipped red offset frames on villa photography.
- Verified on preview: hero animation, marquee, form submit via /api, admin login (12 applications), all PHP files present in build.

### 2026-08-26 iteration 12 — apply → play → admin loop
- Apply success panel now has "Continue to Gaming Zone" button; applicant identity (id/name/email) saved to localStorage as tkk_player.
- Both game versions (embedded React port + standalone gaming-zone.html) post session scores after every round to /api/game/score (upsert by player key; guests get a persistent guest id).
- Admin dashboard now has tabs: Applications | Game Scores (player, email, rounds, wins, best streak, balance, last played).
- PHP: api/game/score.php + api/admin/game_scores.php + game_scores table in setup.php; .htaccess rewrites added. FastAPI mirror endpoints for preview parity.
- Verified full chain on preview: applied as "Gamer Test" → continued to /gamingzone → won a round ($1,175.66) → admin Game Scores tab showed the row instantly. 13 applications total.

### 2026-08-26 iteration 13 — gaming gate flow (user-requested redesign)
- New flow: nav "Gaming Zone" → /gamingzone gate page ("Want to Play?" + application form embedded) → on submit, game unlocks in place ("Playing as {name}" strip). Repeat visitors with tkk_player in localStorage skip the gate.
- Application form extracted to shared src/components/ApplicationForm.jsx (used by landing ApplyForm section AND gaming gate). Homepage embedded game section removed (game lives on its own page now). Nav Gaming Zone link now routes to /gamingzone.
- Verified: gate → submit → unlock → timer ticking (9→7), chart drawing, patterns cycle (Ascending Triangle → Double Top), win/lose results, admin Game Scores rows for each player.

## Placeholders / still needed from user
- Real organizer email for application alerts (currently placeholder in backend/.env ORGANIZER_EMAIL)
- Real event date for countdown (currently 2026-12-18 placeholder in frontend/src/constants.js EVENT_DATE)
- Final 18–20 game names/wording (generic category cards for now)
- Final refund schedule language (policy page marked "subject to final event terms")
- WhatsApp CTA decision (not built)

## Prioritized backlog
### P0 (needed before real launch)
- Real organizer email + real event date
- Final mentor list/photos, final game list, final refund wording

### P1 (Phase 2 conversion polish)
- WhatsApp CTA (floating button / apply section)
- FAQ section, contact block
- Resort gallery expansion, prize visualization, mentor profiles
- SEO/meta/social share (OG tags, share image)

### P2 (Phase 3 ops polish)
- Application status labels (new/contacted/shortlisted/rejected) editable in admin
- Spam protection (rate limit / honeypot / captcha)
- Analytics + event tracking
- Brochure/file uploads via object storage

## Next tasks
1. Collect real organizer email + event date from user; update env/constants
2. Add WhatsApp CTA once confirmed
3. Swap in final mentor/judge + game content
