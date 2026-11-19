from typing import List
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

from app.models.question import Question


class QuestionService:
    CATEGORIES = [
        "Data Structures and Algorithms",
        "Python",
        "Java",
        "Machine Learning",
        "Artificial Intelligence",
        "Database Management Systems",
        "Operating Systems",
        "Computer Networks",
        "System Design",
        "General Technical Interview",
    ]

    DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]

    @classmethod
    def get_categories(cls) -> List[str]:
        return cls.CATEGORIES

    @classmethod
    def get_questions_for_interview(
        cls,
        db: Session,
        category: str,
        difficulty: str,
        count: int = 5
    ) -> List[Question]:
        """
        Retrieves curated questions matching category and difficulty.
        If insufficient questions match the exact difficulty, supplements with
        other questions from the same category to satisfy the count.
        """
        exact_matches = (
            db.query(Question)
            .filter(Question.category == category, Question.difficulty == difficulty)
            .order_by(func.random())
            .limit(count)
            .all()
        )

        if len(exact_matches) >= count:
            return exact_matches

        # Supplement with other difficulties in same category
        needed = count - len(exact_matches)
        existing_ids = [q.id for q in exact_matches]
        supplementary = (
            db.query(Question)
            .filter(Question.category == category, Question.id.notin_(existing_ids))
            .order_by(func.random())
            .limit(needed)
            .all()
        )

        results = exact_matches + supplementary

        # If category still has fewer, supplement with General Technical Interview
        if len(results) < count:
            remaining = count - len(results)
            all_ids = [q.id for q in results]
            generic = (
                db.query(Question)
                .filter(Question.id.notin_(all_ids))
                .order_by(func.random())
                .limit(remaining)
                .all()
            )
            results.extend(generic)

        return results
