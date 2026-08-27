# Phantasm 2026 — Fest Registration

Full-stack registration + payment + admin ledger app.

- **Frontend**: React 19 + Vite + Tailwind CSS 4 (unchanged look & flow — see `frontend/`)
- **Backend**: Node.js 22 + Express (`backend/`)
- **Database**: PostgreSQL
- **Payments**: Cashfree, with an automatic mock mode when no API keys are set
- **Email**: Nodemailer (SMTP), with an automatic console-log mode when no SMTP is set

## What was added to the original frontend-only zip

- `backend/` — a complete Express + PostgreSQL API implementing every
  endpoint the frontend already called (`/api/register`, `/api/team`,
  `/api/payment/create`, `/api/payment/verify`, `/api/admin/*`).
- `frontend/vite.config.js` — was missing from the original zip; without it
  Vite can't run. Sets up the React + Tailwind plugins and a dev proxy so
  `/api/*` calls reach the backend during local development.
- `frontend/.env.example` — for pointing the built frontend at a deployed
  backend URL in production.
- **Forgot-password flow** in `frontend/src/pages/Admin.jsx`: a "Forgot
  password?" link on the admin login screen, a request-reset screen, and a
  set-new-password screen (reached via the emailed link's `?reset_token=`
  query param). Backed by `POST /api/admin/forgot-password` and
  `POST /api/admin/reset-password`, which email a 30-minute reset link via
  Nodemailer.
- `docker-compose.yml` — one command to get a local Postgres running.

The rest of the frontend (`src/components`, `src/pages/Home.jsx`,
`src/pages/Events.jsx`, `src/lib/events.js`, styling, animations) is
untouched — it was already clean, with no dead code, console logs, or
unused files to remove.

## Quick start

### 1. Database

```bash
docker compose up -d          # starts Postgres on localhost:5432
```

(Or point `DATABASE_URL` in `backend/.env` at any Postgres instance you already have.)

### 2. Backend

```bash
cd backend
cp .env.example .env          # then edit .env — see below
npm install
npm run migrate               # creates tables
npm run seed:admin            # creates the admin login from ADMIN_EMAIL/ADMIN_PASSWORD in .env
npm run dev                   # http://localhost:4000
```

Key `.env` values:
- `DATABASE_URL` — defaults match `docker-compose.yml`.
- `SESSION_SECRET` — any long random string.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — used once by `npm run seed:admin` to create the admin account. Change the password afterwards via the "Forgot password?" flow.
- `SMTP_*` — real SMTP creds to actually send emails (registration confirmations, password resets). Leave blank to have emails printed to the backend console instead — the app works fully without them, just without real delivery.
- `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` — real Cashfree sandbox/production credentials. Leave blank to run in mock-payment mode (orders are auto-marked PAID), useful for demos.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173, proxies /api to :4000
```

Visit `http://localhost:5173`. The admin ledger is at `/admin` (password set via `ADMIN_PASSWORD` during seeding).

## Production build

```bash
cd frontend
npm run build                 # outputs static files to frontend/dist
```

Serve `frontend/dist` from any static host, and set `VITE_API_BASE_URL` (frontend `.env`) to your deployed backend's URL before building. Run the backend with `npm start` behind a process manager (pm2, systemd, a container, etc.), pointed at your production Postgres and SMTP/Cashfree credentials.

## API summary

| Method | Path                          | Purpose                                   |
|--------|-------------------------------|--------------------------------------------|
| POST   | `/api/register`               | Create a registration + event entries      |
| GET    | `/api/team`                   | Look up an existing team by name + event   |
| POST   | `/api/payment/create`         | Create a Cashfree order (or mock)          |
| GET    | `/api/payment/verify`         | Verify payment, mark paid, send confirmation email |
| POST   | `/api/admin/login`            | Admin session login                        |
| POST   | `/api/admin/logout`           | Admin session logout                       |
| GET    | `/api/admin/session`          | Check current admin session                |
| GET    | `/api/admin/registrations`    | Full ledger (requires admin session)       |
| POST   | `/api/admin/forgot-password`  | Emails a password-reset link                |
| POST   | `/api/admin/reset-password`   | Sets a new password from a reset token      |

All pricing and event/roster rules are re-validated server-side against `backend/src/data/events.js` — the client-submitted payload is never trusted for prices.

This whole stack was installed, migrated, seeded, and exercised end-to-end (registration → payment → verification → confirmation email, and admin login → forgot-password → email → reset → re-login) during development to confirm it works.
