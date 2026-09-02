# Ledgerly — Financial Habit Builder & Wealth Growth Tracker

A full MERN-stack rebuild of the Ledgerly prototype: **React + Tailwind CSS** frontend, **Node.js + Express** backend, **MongoDB (Mongoose)** database. This replaces the earlier single-file HTML prototype — every feature from that version has an equivalent real API endpoint and React page. The only thing left to do is point `MONGO_URI` at your own database.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Recharts, Axios, Vite |
| Backend | Node.js, Express.js, JSON Web Tokens, bcryptjs |
| Database | MongoDB via Mongoose (works with local MongoDB or MongoDB Atlas) |
| Deployment target | Backend → Render / AWS. Frontend → Vercel / Render static site. |

## Project structure

```
ledgerly/
├── backend/
│   ├── config/db.js            # Mongoose connection
│   ├── models/                 # User, Income, Expense, Habit, Goal, Investment, Feedback
│   ├── middleware/              # JWT auth (protect/adminOnly), error handler
│   ├── controllers/             # Business logic per module
│   ├── routes/                  # Express routers, mounted in server.js
│   ├── server.js                # App entry point + admin auto-seed
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js          # Axios instance with JWT interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/           # Sidebar, PageHead, KpiCard, AuthShell, ProtectedRoute
    │   ├── layouts/               # UserLayout, AdminLayout (separate sidebars/shells)
    │   ├── pages/auth/            # Login, Register (portal toggle: User vs Admin)
    │   ├── pages/user/             # Dashboard, Expenses, Habits, Goals, Analytics, Feedback, Profile
    │   ├── pages/admin/             # AdminUsers, AdminUsage, AdminFeedback, AdminReport
    │   └── App.jsx                  # React Router route table
    └── package.json
```

## 1. Set up MongoDB

Pick one:

- **Local MongoDB**: install MongoDB Community Server, then use `mongodb://127.0.0.1:27017/ledgerly`.
- **MongoDB Atlas** (recommended for deployment): create a free cluster at mongodb.com/atlas, create a database user, allow your IP (or `0.0.0.0/0` for quick testing), and copy the connection string — it looks like:
  ```
  mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/ledgerly
  ```

The API only starts after this URI is configured and MongoDB is reachable. Its connection timeout is 10 seconds, and it reports the connection failure clearly rather than serving requests without a database.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env and set MONGO_URI to your connection string above,
# and set JWT_SECRET to a long random string
npm install
npm run dev        # starts on http://localhost:5000 with nodemon
```

On first boot the server automatically creates a demo admin account (if no admin exists yet) using `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` from `.env` (defaults: `admin` / `admin123`).

`ADMIN_ACCESS_CODE` in `.env` is the code required on the Admin Portal's registration form — change it before deploying publicly.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000` (configured in `vite.config.js`), so just run both servers side by side during development. For a separately deployed API, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the deployed API's `/api` URL. Set backend `CLIENT_URL` to the frontend URL (multiple comma-separated origins are supported).

## 4. Using the app

- Visit `http://localhost:5173/register` to create a **User Portal** account, or toggle to **Admin Portal** and register with the demo code `LEDGER-ADMIN` (or log in with the seeded `admin` / `admin123`).
- User and Admin accounts land in completely separate parts of the app (`/dashboard...` vs `/admin/...`) with their own sidebars — logging into the wrong portal for an account is rejected with a clear message telling you to switch portals.

## API overview

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create a user or admin account |
| POST | `/auth/login` | Log in (body includes `portal: 'user'\|'admin'`) |
| GET | `/auth/me` | Current user |
| PUT | `/profile` | Update name/email |
| PUT | `/profile/password` | Change password |
| DELETE | `/profile` | Delete own account (cascades) |
| GET/POST | `/income` | List / add income records |
| DELETE | `/income/:id` | Delete an income record |
| GET/POST | `/expenses` | List / add expense records |
| DELETE | `/expenses/:id` | Delete an expense record |
| GET/POST | `/habits` | List / add habits |
| PATCH | `/habits/:id/toggle` | Mark/unmark done for current period |
| DELETE | `/habits/:id` | Delete a habit |
| GET/POST | `/goals` | List / add savings goals |
| POST | `/goals/:id/contribute` | Add a contribution to a goal |
| DELETE | `/goals/:id` | Delete a goal |
| GET/POST | `/investments` | List / add investments & assets |
| DELETE | `/investments/:id` | Delete an investment |
| GET/POST | `/feedback` | List (own, or all if admin) / submit feedback |
| PATCH | `/feedback/:id/reply` | Admin: reply and optionally resolve |
| PATCH | `/feedback/:id/reopen` | Admin: reopen a resolved ticket |
| GET | `/reports/monthly` | Download current user's monthly spending report (.txt) |
| GET | `/reports/platform` | Admin: download platform-wide report (.txt) |
| GET | `/admin/users` | Admin: list all users with activity counts |
| PATCH | `/admin/users/:id/role` | Admin: promote/demote a user |
| DELETE | `/admin/users/:id` | Admin: delete a user (cascades) |
| GET | `/admin/usage` | Admin: signups, daily activity, leaderboard |

## Deployment

**Backend (Render or AWS):**
1. Push this repo to GitHub.
2. On Render: New → Web Service → point at `backend/`, build command `npm install`, start command `npm start`.
3. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `ADMIN_ACCESS_CODE`, `CLIENT_URL`, etc.) in the Render dashboard.
4. On AWS, the same app runs on Elastic Beanstalk, an EC2 instance, or as a container on ECS/Fargate — it's a standard Express app with no special requirements.

**Frontend (Vercel or Render static site):**
1. Import the repo into Vercel, set the root directory to `frontend/`.
2. Build command `npm run build`, output directory `dist`.
3. Set an environment variable or edit `vite.config.js`/add an `.env` with `VITE_API_URL` pointing at your deployed backend, and update `src/api/axios.js`'s `baseURL` accordingly (currently it assumes a same-origin `/api` proxy, which works great with Vite's dev proxy but needs an absolute URL — e.g. `https://your-api.onrender.com/api` — once frontend and backend are on different domains in production).

**Media/cloud storage:** not required for the current feature set (reports are generated and streamed on demand, not stored as files). If you later want to persist generated reports or user-uploaded files, wire in AWS S3 or Cloudinary from the `reportController.js` / a new `uploadController.js`.

## Notes on security

This version replaces the prototype's client-side password "obfuscation" with real **bcrypt password hashing** and **JWT-based authentication**, and the admin/user separation is enforced server-side (not just hidden in the UI), so it's now much closer to production-ready. Before a real deployment, also consider: rate limiting on `/auth/login`, HTTPS everywhere, rotating `JWT_SECRET`, and tightening `ADMIN_ACCESS_CODE` distribution.
