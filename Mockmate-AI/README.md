# Mockmate AI — AI-Powered Interview Preparation Platform
> **Practice smarter. Interview better.**

Mockmate AI is a full-stack, enterprise-grade AI technical interview preparation platform designed to help software engineers rigorously practice technical interviews. Featuring an **explainable AI feedback engine**, Mockmate AI evaluates candidate answers across four formal rubric dimensions: **Clarity**, **Relevance**, **Structure**, and **Linguistic Confidence**.

---

## 🌟 Key Features

- **Unified Split-Screen Interview Workspace**: Real-time coding and architectural answering environment with contextual, live AI evaluation panels without page reloads.
- **Explainable 4-Dimension AI Rubric**:
  - **Clarity (1 to 5)**: Audits terminology precision, accessibility, and communication flow.
  - **Relevance (1 to 5)**: Evaluates semantic alignment with domain benchmarks and core concepts.
  - **Structure (1 to 5)**: Analyzes logical sequencing, problem framing, and coherent organization.
  - **Linguistic Confidence (1 to 5)**: Detects assertive technical phrasing and flags tentative hedging markers.
- **Evidence Verification**: Discloses exact textual excerpts from the candidate's answer alongside AI observations (`[Observation: ...]`).
- **Curated 10-Domain Question Bank**: Pre-seeded with 35+ technical interview questions spanning DSA, Python, Java, Machine Learning, AI & Transformers, DBMS, Operating Systems, Computer Networks, System Design, and General Technical topics across **Beginner**, **Intermediate**, and **Advanced** tiers.
- **Server-Sent Events (SSE)**: Live evaluation status updates streamed from FastAPI to the frontend.
- **Persistent Answer Storage**: Local drafts auto-save to browser storage and synchronize with backend database models.
- **Interactive Analytics & Progress Tracking**: Recharts-powered performance progression lines, 4-dimension bar charts, domain competency radar profiles, and distribution charts.
- **Secure Authentication**: Argon2 password hashing and JWT token authorization.
- **Dual Database Flexibility**: Instant zero-setup SQLite for rapid local evaluation or PostgreSQL for containerized production deployment.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide React, Axios, React Router 6 |
| **Backend** | Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, Argon2-cffi, python-jose |
| **AI Engine** | OpenAI Python SDK (GPT-4o-mini structured JSON outputs) + Deterministic Heuristic Fallback Engine |
| **Database** | PostgreSQL (Primary) / SQLite (Zero-config local fallback) |
| **DevOps** | Docker, Docker Compose, Nginx, Render (Backend/DB), Vercel (Frontend) |

---

## 📁 System Architecture & Folder Structure

```text
Mockmate AI/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint & lifespan
│   │   ├── api/routes/
│   │   │   ├── auth.py              # Register, login, session inspection
│   │   │   ├── users.py             # User profile & password management
│   │   │   ├── questions.py         # Curated domain question bank queries
│   │   │   ├── interviews.py        # Interview session lifecycle & submissions
│   │   │   ├── evaluations.py       # Evaluations & Server-Sent Events (SSE)
│   │   │   └── analytics.py         # Dashboard metrics & progress curves
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic BaseSettings environment loader
│   │   │   ├── security.py          # Argon2 hashing & JWT encoding/decoding
│   │   │   └── dependencies.py      # Bearer token authentication dependency
│   │   ├── database/
│   │   │   ├── connection.py        # SQLAlchemy engine & session factory
│   │   │   └── seed_data.py         # Question bank seeding (10 categories)
│   │   ├── models/                  # SQLAlchemy ORM declarative models
│   │   │   ├── user.py
│   │   │   ├── question.py
│   │   │   ├── interview.py
│   │   │   ├── answer.py
│   │   │   └── evaluation.py
│   │   ├── schemas/                 # Pydantic v2 validation models
│   │   ├── services/                # Modular domain business logic
│   │   │   ├── auth_service.py
│   │   │   ├── question_service.py
│   │   │   ├── interview_service.py
│   │   │   └── analytics_service.py
│   │   └── ai/
│   │       ├── prompts.py           # Rubric definitions & JSON Schema
│   │       ├── scoring.py           # Independent backend score computation
│   │       ├── response_parser.py   # Quote extraction & evidence verification
│   │       └── evaluator.py         # OpenAI GPT-4o-mini / fallback engine
│   ├── alembic/                     # Database migrations
│   ├── tests/                       # Automated pytest suite (16 tests)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # AppShell, Collapsible Sidebar, Topbar
│   │   │   ├── interview/           # Split-screen workspace, FeedbackPanel, ScoreMeter
│   │   │   ├── modals/              # NewInterviewModal (configuration)
│   │   │   └── ui/                  # Button, Badge, Card, Modal, Accordion, ProgressBar
│   │   ├── contexts/                # AuthContext, ThemeContext (Light/Dark)
│   │   ├── pages/                   # LandingPage, LoginPage, RegisterPage, Dashboard, History, Progress, Settings
│   │   ├── services/                # Axios API client & SSE consumer
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── vercel.json
├── docker-compose.yml               # Multi-container orchestration (DB, Backend, Frontend)
├── render.yaml                      # Render Blueprint specification
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.10+ (Python 3.12 recommended)
- Node.js 18+ and npm
- (Optional) Docker & Docker Compose

---

### Step 1: Backend Setup

```bash
cd "Mockmate AI/backend"

# 1. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Optional: Add your OPENAI_API_KEY inside .env
# If left blank, Mockmate AI automatically uses its built-in rubric engine!

# 4. Run database migrations and seed questions
alembic upgrade head
python3 -c "from app.database.connection import SessionLocal; from app.database.seed_data import seed_questions; db = SessionLocal(); seed_questions(db); db.close()"

# 5. Start the FastAPI development server
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000`.
Interactive Swagger API documentation is available at `http://localhost:8000/docs`.

---

### Step 2: Frontend Setup

Open a new terminal window:

```bash
cd "Mockmate AI/frontend"

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start Vite development server
npm run dev
```
Frontend application will be accessible at `http://localhost:5173`.

---

### ⚡ 1-Click Demo Evaluation Shortcut
When navigating to the login page (`http://localhost:5173/login`), click the **"1-Click Evaluator Demo Sign In"** button to automatically log in and begin an interview session immediately!

---

## 🧪 Running Automated Tests

Mockmate AI includes a complete automated test suite covering authentication, interview session state, answer submission, independent score calculation, and AI response validation.

```bash
cd "Mockmate AI/backend"
source venv/bin/activate

# Execute pytest suite
pytest -v
```

All tests execute in-memory with zero external paid API requirements.

---

## 🐳 Docker & Docker Compose Setup

To run the complete full-stack environment with PostgreSQL, FastAPI, and React in Docker:

```bash
# In the root project directory:
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 🌐 Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. Link the repository to [Vercel](https://vercel.com).
3. Set the Root Directory to `frontend`.
4. Configure Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api`
5. Deploy. `frontend/vercel.json` ensures all SPA client-side routes resolve accurately.

### Backend Deployment (Render)
1. In [Render](https://render.com), select **New Blueprint Instance** and point to `render.yaml`, or create a **Web Service** pointing to the `backend/` directory.
2. Select Python environment.
3. Build Command: `pip install -r backend/requirements.txt && cd backend && alembic upgrade head`
4. Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Connect your managed Render PostgreSQL database (`DATABASE_URL`).
6. Set Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: `gpt-4o-mini`
   - `FRONTEND_URL`: `https://your-app.vercel.app`

---

## 🛡️ Evaluation Scoring Logic

Mockmate AI ensures mathematical integrity:
$$\text{Overall Score} = \frac{\text{Clarity} + \text{Relevance} + \text{Structure} + \text{Confidence}}{4}$$

- Scores are constrained between **1.0 and 5.0**.
- The backend independently calculates the overall score and verifies whether cited text excerpts genuinely exist within the candidate's submission before categorizing them as verified excerpts or observations.
