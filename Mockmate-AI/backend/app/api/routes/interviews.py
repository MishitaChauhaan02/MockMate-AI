from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.question import Question
from app.schemas.interview import (
    InterviewCreate,
    InterviewResponse,
    InterviewDetailResponse,
    SubmitAnswerRequest,
    InterviewSummaryResponse,
)
from app.schemas.answer import AnswerResponse
from app.schemas.question import QuestionResponse
from app.services.interview_service import InterviewService

router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.post("", response_model=InterviewDetailResponse, status_code=status.HTTP_201_CREATED)
def create_interview(
    request: InterviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview, questions = InterviewService.create_interview(db, current_user.id, request)
    
    return InterviewDetailResponse(
        id=interview.id,
        user_id=interview.user_id,
        category=interview.category,
        difficulty=interview.difficulty,
        total_questions=interview.total_questions,
        mode=interview.mode,
        status=interview.status,
        overall_score=interview.overall_score,
        started_at=interview.started_at,
        completed_at=interview.completed_at,
        answers=[],
        questions=[QuestionResponse.model_validate(q) for q in questions],
    )


@router.get("", response_model=List[InterviewResponse])
def get_user_interviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return InterviewService.list_user_interviews(db, current_user.id, skip=skip, limit=limit)


@router.get("/{interview_id}", response_model=InterviewDetailResponse)
def get_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interview = InterviewService.get_interview(db, current_user.id, interview_id)
    
    # Deterministically load exact questions assigned to this interview
    questions = []
    if interview.question_ids:
        q_dict = {q.id: q for q in db.query(Question).filter(Question.id.in_(interview.question_ids)).all()}
        questions = [q_dict[qid] for qid in interview.question_ids if qid in q_dict]
    else:
        # Fallback for legacy records
        answered_q_ids = [a.question_id for a in interview.answers]
        if answered_q_ids:
            questions = db.query(Question).filter(Question.id.in_(answered_q_ids)).all()
        if len(questions) < interview.total_questions:
            additional = (
                db.query(Question)
                .filter(
                    Question.category == interview.category,
                    Question.id.notin_(answered_q_ids) if answered_q_ids else True,
                )
                .limit(interview.total_questions - len(questions))
                .all()
            )
            questions.extend(additional)

    # Sort answers by question_order
    sorted_answers = sorted(interview.answers, key=lambda a: a.question_order)

    return InterviewDetailResponse(
        id=interview.id,
        user_id=interview.user_id,
        category=interview.category,
        difficulty=interview.difficulty,
        total_questions=interview.total_questions,
        mode=interview.mode,
        status=interview.status,
        overall_score=interview.overall_score,
        started_at=interview.started_at,
        completed_at=interview.completed_at,
        answers=[AnswerResponse.model_validate(a) for a in sorted_answers],
        questions=[QuestionResponse.model_validate(q) for q in questions],
    )


@router.post("/{interview_id}/submit-answer", response_model=AnswerResponse)
def submit_answer(
    interview_id: int,
    submission: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    answer = InterviewService.submit_and_evaluate_answer(
        db, current_user.id, interview_id, submission
    )
    return AnswerResponse.model_validate(answer)


@router.post("/{interview_id}/complete", response_model=InterviewSummaryResponse)
def complete_interview(
    interview_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return InterviewService.complete_interview(db, current_user.id, interview_id)
