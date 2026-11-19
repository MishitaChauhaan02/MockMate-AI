from typing import List, TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.answer import Answer


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    expected_concepts: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    answers: Mapped[List["Answer"]] = relationship("Answer", back_populates="question")
