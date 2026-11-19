# Backend Dockerfile for Mockmate AI
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run database migrations and seed questions on startup, then launch uvicorn
EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && python3 -c 'from app.database.connection import SessionLocal; from app.database.seed_data import seed_questions; db = SessionLocal(); seed_questions(db); db.close()' && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
