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

## Placeholders / still needed from user
- Real organizer email for application alerts (currently placeholder in backend/.env ORGANIZER_EMAIL)
- Real event date for countdown (currently 2026-12-18 placeholder in frontend/src/constants.js EVENT_DATE)
- Final mentor/judge names + photos (cards currently "Revealing soon")
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
