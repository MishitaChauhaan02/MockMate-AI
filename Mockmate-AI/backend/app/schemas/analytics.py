from typing import List, Dict, Optional
from pydantic import BaseModel, Field

from app.schemas.interview import InterviewResponse


class DashboardStats(BaseModel):
    total_interviews: int
    average_score: float
    best_score: float
    total_questions_answered: int
    recent_interviews: List[InterviewResponse] = Field(default_factory=list)


class TrendPoint(BaseModel):
    date: str
    score: float
    category: str


class SkillPerformance(BaseModel):
    category: str
    average_score: float
    interviews_count: int


class DimensionAverage(BaseModel):
    dimension: str
    score: float


class ProgressAnalytics(BaseModel):
    overall_trend: List[TrendPoint]
    dimension_averages: Dict[str, float]
    skill_profiles: List[SkillPerformance]
    strongest_skill: Optional[str] = None
    weakest_skill: Optional[str] = None
    recommendations: List[str] = Field(default_factory=list)