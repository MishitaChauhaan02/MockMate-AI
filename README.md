# MockMate AI – AI-Powered Technical Interview Preparation Platform

> Practice smarter. Interview better.

MockMate AI is a full-stack AI-powered platform designed to help developers prepare for technical interviews through structured mock interviews, automated answer evaluation, and personalized performance analytics.

Candidates can practice questions across different technical categories and difficulty levels, receive AI-generated feedback, identify areas for improvement, and track their progress over time.

## ✨ Features

- **User Authentication:** Secure registration and login using JWT-based authentication.
- **Mock Interviews:** Create interviews based on technical categories, difficulty levels, and question counts.
- **AI-Powered Evaluation:** Evaluate answers using OpenAI models with structured JSON responses.
- **Four-Dimensional Scoring:** Assess answers across:
  - Clarity
  - Relevance
  - Structure
  - Linguistic Confidence
- **Explainable Feedback:** Receive score explanations, supporting evidence, strengths, weaknesses, and improvement suggestions.
- **Suggested Answers:** Review improved answer suggestions and missing concepts.
- **Evaluation Fallback:** A rule-based heuristic evaluator provides feedback when an OpenAI API key is unavailable or the AI evaluation fails.
- **Performance Dashboard:** View interview statistics and performance summaries.
- **Progress Analytics:** Track scores and identify stronger and weaker evaluation dimensions.
- **Interview History:** Review previous interview attempts and their results.
- **Persistent Storage:** Store users, interviews, answers, and evaluations in a relational database.

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- JWT Authentication
- Argon2 / bcrypt password hashing

### AI & Evaluation
- OpenAI API
- GPT-4o-mini (configurable)
- Structured JSON output
- Custom evaluation prompts and scoring logic
- Rule-based heuristic fallback

### Database
- SQLite
- PostgreSQL
- Docker & Docker Compose

## 🏗️ Project Architecture

```text
Mockmate-AI/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── evaluator.py
│   │   │   ├── prompts.py
│   │   │   ├── response_parser.py
│   │   │   └── scoring.py
│   │   │
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── questions.py
│   │   │       ├── interviews.py
│   │   │       ├── evaluations.py
│   │   │       └── analytics.py
│   │   │
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.ts
│
├── docker-compose.yml
├── render.yaml
├── .env.example
└── README.md
```

## ⚙️ How It Works

1. **Authentication:** Users register or log in and receive a JWT access token.
2. **Interview Creation:** The user selects a technical category, difficulty, interview mode, and number of questions.
3. **Question Selection:** The backend retrieves suitable questions from the question database.
4. **Answer Submission:** Candidate answers are submitted through the frontend to the FastAPI backend.
5. **AI Evaluation:** The evaluation engine analyzes the answer against the question, difficulty, and expected concepts.
6. **Scoring:** The system generates four dimension-wise scores and calculates an overall score.
7. **Feedback Generation:** Candidates receive explanations, evidence, strengths, weaknesses, missing concepts, and suggested improvements.
8. **Analytics:** Interview results are stored and used to generate performance summaries and progress insights.

## 🧠 Evaluation Methodology

MockMate AI evaluates technical interview answers using four dimensions, each scored on a scale of 1 to 5.

| Dimension | What it evaluates |
|---|---|
| Clarity | How clearly the candidate explains concepts |
| Relevance | How closely the answer addresses the question |
| Structure | Organization and logical flow of the explanation |
| Linguistic Confidence | Assertiveness and clarity of language |

The overall score is calculated as:

**Overall Score = (Clarity + Relevance + Structure + Confidence) / 4**

The AI evaluator uses structured output to produce consistent evaluation results. If AI evaluation is unavailable, the application uses a rule-based heuristic fallback.

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- OpenAI API key (optional; enables AI-powered evaluation)
- PostgreSQL (optional for local development with SQLite)

### 1. Clone the Repository

```bash
git clone https://github.com/MishitaChauhaan02/MockMate-AI.git
cd MockMate-AI/Mockmate-AI
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
DATABASE_URL=sqlite:///./mockmate.db
SECRET_KEY=your-generated-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=10080
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=http://localhost:5173
```

Apply database migrations:

```bash
alembic upgrade head
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend API: `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

### 3. Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd MockMate-AI/Mockmate-AI/frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Start the development server:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

### 4. Run with Docker

From the `Mockmate-AI` project root, configure the required variables in a local `.env` file using `.env.example` as a reference.

Then run:

```bash
docker compose up --build
```

The application services are available at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

## 🧪 Running Tests

Navigate to the backend directory and run:

```bash
pytest -v
```

## 🔐 Security

- JWT-based authentication protects user-specific API endpoints.
- Passwords are stored using secure password hashing.
- Environment variables are used for API keys and application secrets.
- Interview and evaluation access is restricted to the authenticated owner.
- Real `.env` files and local databases should never be committed to GitHub.

## 🔮 Future Improvements

- Real-time voice-based mock interviews.
- Live coding interview environment.
- More advanced evaluation rubrics.
- Expanded technical question bank.
- Additional LLM provider integrations.
- Deeper personalized learning recommendations.


If you find this project useful, consider giving the repository a ⭐ on GitHub!
