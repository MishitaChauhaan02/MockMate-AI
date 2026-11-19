from typing import List, Dict, Any, TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import Integer, Float, Text, JSON, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.answer import Answer


class Evaluation(Base):
    __tablename__ = "evaluations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    answer_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("answers.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    
    # 4-Dimension Rubric Scores (1.0 to 5.0)
    clarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    relevance_score: Mapped[float] = mapped_column(Float, nullable=False)
    structure_score: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Backend-calculated overall score: (C + R + S + C) / 4
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    
    # Dimension Explanations
    clarity_explanation: Mapped[str] = mapped_column(Text, nullable=False)
    relevance_explanation: Mapped[str] = mapped_column(Text, nullable=False)
    structure_explanation: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_explanation: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Evidence (structured map of quotes/observations per dimension)
    evidence: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    
    # Qualitative Feedback
    strengths: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    weaknesses: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    improvement_suggestions: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    missing_concepts: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    
    # Suggested Model / Reference Answer
    suggested_answer: Mapped[str] = mapped_column(Text, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationship
    answer: Mapped["Answer"] = relationship("Answer", back_populates="evaluation")
