from typing import List, Optional, TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.answer import Answer


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    mode: Mapped[str] = mapped_column(String(50), nullable=False, default="practice")  # "practice" or "assessment"
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="in_progress")  # "in_progress", "completed"
    overall_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    question_ids: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="interviews")
    answers: Mapped[List["Answer"]] = relationship(
        "Answer", back_populates="interview", cascade="all, delete-orphan", order_by="Answer.question_order"
    )
