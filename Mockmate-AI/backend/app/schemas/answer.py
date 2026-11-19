from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.question import QuestionResponse
from app.schemas.evaluation import EvaluationResponse


class AnswerCreate(BaseModel):
    question_id: int
    answer_text: str = Field(..., min_length=1)
    question_order: int = Field(..., ge=1)


class AnswerResponse(BaseModel):
    id: int
    interview_id: int
    question_id: int
    answer_text: str
    question_order: int
    submitted_at: datetime
    question: Optional[QuestionResponse] = None
    evaluation: Optional[EvaluationResponse] = None

    model_config = ConfigDict(from_attributes=True)
