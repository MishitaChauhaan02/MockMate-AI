from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.question import QuestionResponse
from app.schemas.answer import AnswerResponse


class InterviewCreate(BaseModel):
    category: str = Field(..., description="Interview category")
    difficulty: str = Field(..., description="Beginner, Intermediate, or Advanced")
    total_questions: int = Field(5, ge=1, le=20)
    mode: str = Field("practice", description="'practice' or 'assessment'")


class InterviewResponse(BaseModel):
    id: int
    user_id: int
    category: str
    difficulty: str
    total_questions: int
    mode: str
    status: str
    overall_score: Optional[float] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class InterviewDetailResponse(InterviewResponse):
    answers: List[AnswerResponse] = []
    questions: List[QuestionResponse] = []

    model_config = ConfigDict(from_attributes=True)


class SubmitAnswerRequest(BaseModel):
    question_id: int
    answer_text: str = Field(..., min_length=2)
    question_order: int = Field(..., ge=1)


class InterviewSummaryResponse(BaseModel):
    interview_id: int
    category: str
    difficulty: str
    mode: str
    status: str
    total_questions: int
    questions_attempted: int
    overall_score: float
    average_clarity: float
    average_relevance: float
    average_structure: float
    average_confidence: float
    strongest_dimension: str
    weakest_dimension: str
    key_strengths: List[str]
    areas_for_improvement: List[str]
    personalized_recommendations: List[str]
