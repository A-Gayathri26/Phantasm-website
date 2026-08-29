# Phantasm — Login/Register/Forgot-Password App

Full stack now: your existing React frontend + a new **Node.js 22 + Express + PostgreSQL** backend.

```
project/
├─ frontend/          your original Vite/React app (routes wired to real API calls)
└─ backend/            new Express API + PostgreSQL
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env      # edit DB creds / JWT secret
```

Create the database (adjust name/user to match your .env):

```bash
createdb phantasm
```

Run migrations (creates `users` and `password_reset_tokens` tables):

```bash
npm run migrate
```

Start the API:

```bash
npm run dev      # auto-restarts on changes (Node 22 --watch)
# or
npm start
```

API runs at `http://localhost:5000`, endpoints under `/api/auth`:

| Method | Route                     | Body                                      |
|--------|---------------------------|--------------------------------------------|
| POST   | `/api/auth/register`      | `{ name, email, mobile, password }`        |
| POST   | `/api/auth/login`         | `{ email, password }`                      |
| POST   | `/api/auth/logout`        | –                                          |
| GET    | `/api/auth/me`            | – (requires auth cookie or Bearer token)   |
| POST   | `/api/auth/forgot-password` | `{ email }`                              |
| POST   | `/api/auth/reset-password`  | `{ token, password }`                    |

Security notes:
- Passwords hashed with bcrypt (12 rounds).
- JWT issued on register/login, set as an httpOnly cookie **and** returned in the JSON body (so the SPA can also use `Authorization: Bearer <token>` if you prefer localStorage).
- `forgot-password` never reveals whether an email exists; in non-production mode it also returns the raw reset token in the response (`devResetToken`) so you can test the flow without wiring up an email provider yet. Wire real email sending (e.g. via a transactional email API) before going to production, and remove `devResetToken` from the response at that point.
- Rate limiting (20 requests / 15 min) on all auth endpoints.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL, defaults to http://localhost:5000/api
npm run dev
```

The Login, Register, and Forgot Password pages now call the backend via `src/lib/api.js` instead of `alert()`/`localStorage` stubs, with loading states and inline error messages.

## 3. Running both together

Open two terminals: one running the backend (`npm run dev` in `backend/`), one running the frontend (`npm run dev` in `frontend/`). The frontend dev server (Vite, port 5173) is already allowed by the backend's CORS config (`CLIENT_ORIGIN` in `.env`).

## What's still on you

- No protected "dashboard" page exists yet — after login the app just shows a success alert. Add a route + guard (check `/api/auth/me`) when you're ready for a post-login page.
- Password reset emails aren't actually sent — the token is logged to the server console / returned in dev mode. Plug in an email provider (Resend, SES, SendGrid, etc.) in `authController.js` → `forgotPassword`.
- For production: set `NODE_ENV=production`, use a strong random `JWT_SECRET`, run behind HTTPS (so the `secure` cookie flag applies), and point `DATABASE_URL` at your managed Postgres instance.
