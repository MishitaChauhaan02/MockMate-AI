
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.evaluation import Evaluation
from app.models.answer import Answer
from app.models.interview import Interview
from app.schemas.evaluation import EvaluationResponse
from app.services.interview_service import InterviewService

router = APIRouter(prefix="", tags=["Evaluations"])


@router.get("/evaluations/{evaluation_id}", response_model=EvaluationResponse)
def get_evaluation(
    evaluation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    evaluation = (
        db.query(Evaluation)
        .join(Answer)
        .join(Interview)
        .filter(
            Evaluation.id == evaluation_id,
            Interview.user_id == current_user.id,
        )
        .first()
    )

    if not evaluation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evaluation not found or access denied",
        )

    return EvaluationResponse.model_validate(evaluation)


@router.get(
    "/interviews/{interview_id}/evaluations",
    response_model=List[EvaluationResponse],
)
def get_interview_evaluations(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview = InterviewService.get_interview(
        db,
        current_user.id,
        interview_id,
    )

    evaluations = (
        db.query(Evaluation)
        .join(Answer)
        .filter(Answer.interview_id == interview.id)
        .all()
    )

    return [
        EvaluationResponse.model_validate(evaluation)
        for evaluation in evaluations
    ]
