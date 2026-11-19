from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.question import Question
from app.schemas.question import QuestionResponse
from app.services.question_service import QuestionService

router = APIRouter(prefix="/questions", tags=["Questions"])


@router.get("/categories", response_model=List[str])
def get_categories():
    return QuestionService.get_categories()


@router.get("", response_model=List[QuestionResponse])
def get_questions(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Question)
    if category:
        query = query.filter(Question.category == category)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    return query.limit(limit).all()
