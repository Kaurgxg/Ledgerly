# Ledgerly — Personal Finance Management & Analytics Platform

Ledgerly is a full-stack personal finance management platform that helps users manage their income, expenses, saving goals, financial habits, and overall financial activity from a single dashboard.

The platform also includes a dedicated **Admin Portal** for user management, feedback handling, and platform usage analytics.

---

## 🚀 Live Demo

**Frontend:**  
https://ledgerly-gg.vercel.app

**Backend API:**  
https://ledgerly-one-alpha.vercel.app

**GitHub Repository:**  
https://github.com/Kaurgxg/Ledgerly

---

## ✨ Features

### 👤 User Portal

- Secure user registration and login
- Financial dashboard with overall financial summary
- Add and manage income records
- Add and manage expense records
- Track cash flow and savings rate
- Create and track saving goals
- Add contributions towards saving goals
- Create and track financial habits
- Habit check-ins and progress tracking
- Financial analytics
- Submit feedback and complaints
- View admin responses
- Profile management
- Change account password
- Forgot-password and email-based password reset

### 🛡️ Admin Portal

- Separate admin authentication and portal
- View and manage registered users
- Grant or revoke admin privileges
- Monitor platform usage
- View active users and engagement information
- Track habit check-ins
- View signup trends
- View daily platform activity
- View most active users
- Manage user feedback and complaints
- Reply to and resolve feedback
- Reopen resolved feedback
- Generate platform analytics reports

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| API Communication | Axios, REST APIs |
| Charts & Analytics | Recharts |
| Version Control | Git, GitHub |
| Deployment | Vercel |

---

## 📁 Project Structure

```text
Ledgerly/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── incomeController.js
│   │   ├── expenseController.js
│   │   ├── habitController.js
│   │   ├── goalController.js
│   │   ├── feedbackController.js
│   │   ├── adminController.js
│   │   └── reportController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Income.js
│   │   ├── Expense.js
│   │   ├── Habit.js
│   │   ├── Goal.js
│   │   └── Feedback.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │
│   ├── server.js
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── layouts/
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── user/
    │   │   └── admin/
    │   └── App.jsx
    │
    ├── package.json
    └── vite.config.js
```

---

## 🖥️ Application Modules

### 📊 Dashboard

The user dashboard provides an overview of financial activity, including:

- Total income
- Total expenses
- Savings rate
- Cash flow
- Recent financial activity
- Habit progress
- Saving goal progress

### 💰 Income & Expenses

Users can add, view, and delete financial records to maintain an organized record of their income and spending.

### 🎯 Saving Goals

Users can create financial goals, add contributions, and track their progress towards each goal.

### 🔄 Habit Tracker

Users can create financial habits and record their progress through regular check-ins.

### 📈 Analytics

Ledgerly provides visual analytics to help users understand their financial activity and progress.

### 💬 Feedback System

Users can submit feedback or complaints to administrators.

Administrators can:

- Review feedback
- Reply to users
- Resolve feedback
- Reopen resolved feedback

### 🛡️ Admin Analytics

Administrators can monitor platform activity through:

- Active users
- User engagement
- Habit check-ins
- Weekly signups
- Daily activity
- Most active users
- Platform usage statistics

---

## 🔐 Authentication & Security

Ledgerly uses several security mechanisms to protect user accounts and API resources:

- **JWT** for authentication
- **bcryptjs** for password hashing
- Role-based authorization for User and Admin accounts
- Protected API routes
- Separate User and Admin interfaces
- Server-side permission checks
- Password reset functionality
- Environment variables for sensitive configuration

Sensitive configuration such as database credentials and JWT secrets are stored using environment variables and are not committed to the repository.

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Kaurgxg/Ledgerly.git
cd Ledgerly
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_ACCESS_CODE=your_admin_access_code
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

For a separately deployed backend, configure:

```env
VITE_API_URL=your_backend_api_url/api
```

---

## 🔗 API Overview

All API routes are prefixed with `/api`.

Protected routes require:

```text
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user/admin |
| POST | `/auth/login` | Login |
| POST | `/auth/forgot-password` | Request password reset |
| PUT | `/auth/reset-password/:token` | Reset password |
| GET | `/auth/me` | Get current user |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/profile` | Update profile |
| PUT | `/profile/password` | Change password |
| DELETE | `/profile` | Delete account |

### Finance

| Method | Endpoint | Description |
|---|---|---|
| GET | `/income` | Get income records |
| POST | `/income` | Add income |
| DELETE | `/income/:id` | Delete income |
| GET | `/expenses` | Get expense records |
| POST | `/expenses` | Add expense |
| DELETE | `/expenses/:id` | Delete expense |

### Habits & Goals

| Method | Endpoint | Description |
|---|---|---|
| GET | `/habits` | Get habits |
| POST | `/habits` | Create habit |
| PATCH | `/habits/:id/toggle` | Toggle habit check-in |
| DELETE | `/habits/:id` | Delete habit |
| GET | `/goals` | Get saving goals |
| POST | `/goals` | Create saving goal |
| POST | `/goals/:id/contribute` | Add goal contribution |
| DELETE | `/goals/:id` | Delete goal |

### Feedback

| Method | Endpoint | Description |
|---|---|---|
| GET | `/feedback` | Get feedback |
| POST | `/feedback` | Submit feedback |
| PATCH | `/feedback/:id/reply` | Admin reply/resolve |
| PATCH | `/feedback/:id/reopen` | Reopen feedback |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports/monthly` | Generate user's monthly report |
| GET | `/reports/platform` | Generate admin platform report |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users` | Get users |
| PATCH | `/admin/users/:id/role` | Change user role |
| DELETE | `/admin/users/:id` | Delete user |
| GET | `/admin/usage` | Get platform analytics |

---

## ☁️ Deployment

Ledgerly is deployed using **Vercel**.

### Frontend

The React/Vite frontend is deployed as a Vercel project with:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

### Backend

The Express backend is deployed separately on Vercel with:

```text
Root Directory: backend
```

The production backend connects to MongoDB Atlas using environment variables.

---



## 🎯 Project Highlights

- Full-stack MERN application
- Responsive user interface
- Separate User and Admin portals
- JWT-based authentication
- Secure password hashing
- MongoDB database integration
- RESTful backend APIs
- Financial and platform analytics
- Saving goals and habit tracking
- Feedback management system
- Admin user management
- Cloud deployment
- Production frontend, backend, and database integration

---

## 📚 What I Learned

Through this project, I gained practical experience in:

- Building full-stack applications using the MERN stack
- Designing and consuming REST APIs
- MongoDB database design and Mongoose
- Authentication and authorization
- Role-based access control
- Responsive frontend development
- API and database debugging
- Cloud deployment
- Managing environment variables
- Connecting frontend, backend, and database services in production

---

## 🔮 Future Improvements
Some possible future enhancements include:

- AI-powered financial insights
- Personalized spending recommendations
- Budget prediction
- Automated financial summaries
- More advanced financial analytics
- Automatic expense categorization
- Notification and reminder system
- Mobile application

---

## 👨‍💻 Author
Gurnoor Kaur

Built as an internship project for **Unified Mentor**.

---

## 📄 License
This project is developed for educational, internship, and portfolio purposes.
