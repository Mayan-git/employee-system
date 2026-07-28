# EmployeeAI — HR Performance Analytics

A full-stack HR tool for tracking employee performance, with AI-generated promotion, training,
and ranking recommendations. Originally a student project, rebuilt as a production-style MERN
application with role-based access control, hardened security, and a modern UI.

**Live demo:** _add your deployed URL here_
**API base URL:** _add your deployed API URL here_

![Login screenshot placeholder](docs/screenshots/login.png)
![Dashboard screenshot placeholder](docs/screenshots/employees.png)
![AI insights screenshot placeholder](docs/screenshots/ai-insights.png)

## Features

- **Auth** — JWT-based signup/login. The first account ever created is automatically promoted
  to admin; everyone after starts as a manager.
- **Role-based access control**
  - **Admin**: full employee CRUD, and can promote/demote other users between admin and manager
  - **Manager**: can view, search, and update only the performance score of an employee
- **Employee directory** — search by name, filter by department, paginated
- **AI recommendations** — sends anonymized performance data (no names or emails) to an LLM via
  OpenRouter and returns promotion/training/ranking recommendations per employee
- **Dark / light mode**, fully responsive, loading/error/empty states throughout

## Tech stack

| Layer      | Technology                                                          |
| ---------- | -------------------------------------------------------------------- |
| Frontend   | React 19 (Vite), Tailwind CSS, React Router, Framer Motion, Axios     |
| Backend    | Node.js, Express, Mongoose (MongoDB), Zod validation                 |
| Auth       | JWT + bcrypt                                                          |
| AI         | OpenRouter (GPT-4o-mini) via a PII-anonymizing proxy endpoint         |
| Testing    | Vitest + Supertest (backend), Vitest + React Testing Library (frontend) |

### Why MongoDB over Firestore

The data model is flat and document-shaped (employees with an array of skills, no relational
joins), which is exactly what Mongoose schemas are built for. The project already had working
Mongoose models, so keeping MongoDB avoided a migration with no real upside — the trade-off would
have been added risk for a data shape that doesn't benefit from Firestore's strengths (realtime
listeners, offline sync), neither of which this app needs.

## Project structure

```
backend/
  config/       # env validation, DB connection
  controllers/  # request handlers
  middleware/   # auth, role authorization, validation, rate limiting, error handling
  models/       # Mongoose schemas
  routes/       # Express routers
  utils/        # ApiError, asyncHandler, regex-escaping, AI anonymization
  validators/   # Zod request schemas
  tests/

frontend/
  src/
    components/ # ui/ (primitives), layout/, employees/
    context/    # AuthContext, ThemeContext
    hooks/      # useEmployees, useDebounce
    pages/      # route-level components
    services/   # axios API layer
    utils/
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB connection string ([MongoDB Atlas](https://www.mongodb.com/atlas) free tier works well)
- (Optional) An [OpenRouter](https://openrouter.ai) API key to enable AI recommendations

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET at minimum
npm run dev             # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # defaults to http://localhost:5000/api
npm run dev              # starts on http://localhost:5173
```

Sign up for an account — the first one becomes an admin automatically, so you can immediately add
employees and manage roles from the **Team** page.

### Running tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Environment variables

**backend/.env**

| Variable              | Description                                              |
| ---------------------- | ---------------------------------------------------------- |
| `MONGO_URI`            | MongoDB connection string                                 |
| `JWT_SECRET`           | Long random string used to sign JWTs                      |
| `JWT_EXPIRES_IN`       | Token lifetime (default `7d`)                              |
| `CORS_ORIGIN`          | Allowed frontend origin                                    |
| `OPENROUTER_API_KEY`   | Optional — enables `/api/ai/recommend`                     |

**frontend/.env**

| Variable        | Description                                  |
| ---------------- | ----------------------------------------------- |
| `VITE_API_URL`   | Backend API base URL, including `/api`         |

## Deployment

- **Frontend → Vercel**: import the `frontend/` directory as the project root, set `VITE_API_URL`
  to your deployed backend URL. `vercel.json` is already configured to rewrite all routes to
  `index.html` for client-side routing.
- **Backend → Render/Railway**: a `render.yaml` blueprint is included at the repo root (points at
  `backend/` as the root directory). Set `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN` (your Vercel
  URL), and optionally `OPENROUTER_API_KEY` in the service's environment settings.

## Security notes

- Employee search input is escaped before being used in a MongoDB `$regex` query to prevent
  regex-injection/ReDoS.
- Managers can only ever modify `performanceScore` — the API enforces this server-side regardless
  of what a client sends.
- Employee names and emails are stripped before any data reaches the third-party AI provider.
- Startup fails fast with a clear error if required environment variables are missing, rather than
  failing unpredictably later.
- Auth endpoints are rate-limited; API responses use `helmet` security headers and a restricted
  CORS origin.
