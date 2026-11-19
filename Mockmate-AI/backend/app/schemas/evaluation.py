from datetime import datetime
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class EvaluationScores(BaseModel):
    clarity: float = Field(..., ge=1.0, le=5.0)
    relevance: float = Field(..., ge=1.0, le=5.0)
    structure: float = Field(..., ge=1.0, le=5.0)
    confidence: float = Field(..., ge=1.0, le=5.0)


class DimensionExplanations(BaseModel):
    clarity: str
    relevance: str
    structure: str
    confidence: str


class DimensionEvidence(BaseModel):
    clarity: Optional[str] = ""
    relevance: Optional[str] = ""
    structure: Optional[str] = ""
    confidence: Optional[str] = ""


class EvaluationResult(BaseModel):
    scores: EvaluationScores
    overall_score: float = Field(..., ge=1.0, le=5.0)
    explanations: DimensionExplanations
    evidence: DimensionEvidence
    strengths: List[str]
    weaknesses: List[str]
    improvement_suggestions: List[str]
    missing_concepts: List[str]
    suggested_answer: str


class EvaluationResponse(BaseModel):
    id: int
    answer_id: int
    clarity_score: float
    relevance_score: float
    structure_score: float
    confidence_score: float
    overall_score: float
    clarity_explanation: str
    relevance_explanation: str
    structure_explanation: str
    confidence_explanation: str
    evidence: Dict[str, Any]
    strengths: List[str]
    weaknesses: List[str]
    improvement_suggestions: List[str]
    missing_concepts: List[str]
    suggested_answer: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
