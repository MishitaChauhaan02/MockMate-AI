from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.interview import Interview
    from app.models.question import Question
    from app.models.evaluation import Evaluation


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    interview_id: Mapped[int] = mapped_column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"), index=True, nullable=False)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("questions.id"), index=True, nullable=False)
    answer_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_order: Mapped[int] = mapped_column(Integer, nullable=False)
    
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    interview: Mapped["Interview"] = relationship("Interview", back_populates="answers")
    question: Mapped["Question"] = relationship("Question", back_populates="answers")
    evaluation: Mapped[Optional["Evaluation"]] = relationship(
        "Evaluation", back_populates="answer", uselist=False, cascade="all, delete-orphan"
    )
