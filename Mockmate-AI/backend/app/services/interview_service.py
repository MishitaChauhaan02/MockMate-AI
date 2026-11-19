
from datetime import datetime, timezone
from typing import List, Tuple

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.interview import Interview
from app.models.question import Question
from app.models.answer import Answer
from app.models.evaluation import Evaluation

from app.schemas.interview import (
    InterviewCreate,
    SubmitAnswerRequest,
    InterviewSummaryResponse,
)

from app.services.question_service import QuestionService
from app.ai.evaluator import evaluate_interview_answer


class InterviewService:

    @staticmethod
    def create_interview(
        db: Session,
        user_id: int,
        request: InterviewCreate,
    ) -> Tuple[Interview, List[Question]]:

        questions = QuestionService.get_questions_for_interview(
            db,
            request.category,
            request.difficulty,
            request.total_questions,
        )

        if not questions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No questions available for category '{request.category}'",
            )

        interview = Interview(
            user_id=user_id,
            category=request.category,
            difficulty=request.difficulty,
            total_questions=len(questions),
            mode=request.mode,
            status="in_progress",
            started_at=datetime.now(timezone.utc),
            question_ids=[q.id for q in questions],
        )

        try:
            db.add(interview)
            db.commit()
            db.refresh(interview)
            return interview, questions
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get_interview(
        db: Session,
        user_id: int,
        interview_id: int,
    ) -> Interview:

        interview = (
            db.query(Interview)
            .filter(Interview.id == interview_id)
            .first()
        )

        if not interview:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview not found",
            )

        if interview.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this interview",
            )

        return interview

    @staticmethod
    def list_user_interviews(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Interview]:

        return (
            db.query(Interview)
            .filter(Interview.user_id == user_id)
            .order_by(Interview.started_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def submit_and_evaluate_answer(
        db: Session,
        user_id: int,
        interview_id: int,
        submission: SubmitAnswerRequest,
    ) -> Answer:

        interview = InterviewService.get_interview(
            db,
            user_id,
            interview_id,
        )

        if interview.status == "completed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Interview is already completed. Answers cannot be modified.",
            )

        question_ids = interview.question_ids or []

        if submission.question_id not in question_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This question is not part of the interview.",
            )

        question = (
            db.query(Question)
            .filter(Question.id == submission.question_id)
            .first()
        )

        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found",
            )

        expected_order = question_ids.index(submission.question_id) + 1

        if submission.question_order != expected_order:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid question order.",
            )

        try:
            existing_answer = (
                db.query(Answer)
                .filter(
                    Answer.interview_id == interview_id,
                    Answer.question_id == submission.question_id,
                )
                .first()
            )

            if existing_answer:
                answer = existing_answer
                answer.answer_text = submission.answer_text
                answer.submitted_at = datetime.now(timezone.utc)

            else:
                answer = Answer(
                    interview_id=interview_id,
                    question_id=submission.question_id,
                    answer_text=submission.answer_text,
                    question_order=submission.question_order,
                    submitted_at=datetime.now(timezone.utc),
                )

                db.add(answer)

            db.flush()

            eval_result = evaluate_interview_answer(
                question_text=question.question_text,
                category=question.category,
                difficulty=question.difficulty,
                expected_concepts=question.expected_concepts or [],
                candidate_answer=submission.answer_text,
            )

            scores = eval_result["scores"]
            explanations = eval_result["explanations"]
            evidence = eval_result["evidence"]

            if answer.evaluation:
                evaluation = answer.evaluation
            else:
                evaluation = Evaluation(answer_id=answer.id)
                db.add(evaluation)

            evaluation.clarity_score = scores["clarity"]
            evaluation.relevance_score = scores["relevance"]
            evaluation.structure_score = scores["structure"]
            evaluation.confidence_score = scores["confidence"]
            evaluation.overall_score = eval_result["overall_score"]

            evaluation.clarity_explanation = explanations["clarity"]
            evaluation.relevance_explanation = explanations["relevance"]
            evaluation.structure_explanation = explanations["structure"]
            evaluation.confidence_explanation = explanations["confidence"]

            evaluation.evidence = evidence
            evaluation.strengths = eval_result["strengths"]
            evaluation.weaknesses = eval_result["weaknesses"]
            evaluation.improvement_suggestions = eval_result[
                "improvement_suggestions"
            ]
            evaluation.missing_concepts = eval_result["missing_concepts"]
            evaluation.suggested_answer = eval_result["suggested_answer"]

            db.commit()
            db.refresh(answer)

            return answer

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def complete_interview(
        db: Session,
        user_id: int,
        interview_id: int,
    ) -> InterviewSummaryResponse:

        interview = InterviewService.get_interview(
            db,
            user_id,
            interview_id,
        )

        answers = (
            db.query(Answer)
            .filter(Answer.interview_id == interview_id)
            .all()
        )

        evaluations = [
            answer.evaluation
            for answer in answers
            if answer.evaluation is not None
        ]

        if not evaluations:
            overall_score = 0.0
            avg_clarity = 0.0
            avg_relevance = 0.0
            avg_structure = 0.0
            avg_conf = 0.0

            strongest = "N/A"
            weakest = "N/A"

            strengths = ["No answers submitted yet."]
            weaknesses = ["No answers were evaluated."]

            recommendations = [
                "Complete questions to generate actionable recommendations."
            ]

        else:
            avg_clarity = round(
                sum(e.clarity_score for e in evaluations) / len(evaluations), 2
            )

            avg_relevance = round(
                sum(e.relevance_score for e in evaluations) / len(evaluations), 2
            )

            avg_structure = round(
                sum(e.structure_score for e in evaluations) / len(evaluations), 2
            )

            avg_conf = round(
                sum(e.confidence_score for e in evaluations) / len(evaluations), 2
            )

            overall_score = round(
                (avg_clarity + avg_relevance + avg_structure + avg_conf) / 4.0,
                2,
            )

            dimension_map = {
                "Clarity": avg_clarity,
                "Relevance": avg_relevance,
                "Structure": avg_structure,
                "Linguistic Confidence": avg_conf,
            }

            strongest = max(dimension_map, key=dimension_map.get)
            weakest = min(dimension_map, key=dimension_map.get)

            strengths = []
            weaknesses = []

            for evaluation in evaluations:
                for item in evaluation.strengths or []:
                    if item not in strengths and len(strengths) < 4:
                        strengths.append(item)

                for item in evaluation.weaknesses or []:
                    if item not in weaknesses and len(weaknesses) < 4:
                        weaknesses.append(item)

            recommendations = [
                (
                    f"Focus on strengthening {weakest.lower()} "
                    "by grounding explanations in standard industry patterns."
                ),
                (
                    "Review missing concepts from your evaluated answers "
                    "before attempting advanced interviews."
                ),
                (
                    f"Leverage your proven {strongest.lower()} skills "
                    "to frame complex system tradeoffs assertively."
                ),
            ]

        try:
            # Only mark and save completion once.
            # Repeated requests return the existing interview summary.
            if interview.status != "completed":
                interview.status = "completed"
                interview.overall_score = overall_score
                interview.completed_at = datetime.now(timezone.utc)

                db.commit()
                db.refresh(interview)

        except Exception:
            db.rollback()
            raise

        return InterviewSummaryResponse(
            interview_id=interview.id,
            category=interview.category,
            difficulty=interview.difficulty,
            mode=interview.mode,
            status=interview.status,
            total_questions=interview.total_questions,
            questions_attempted=len(answers),
            overall_score=overall_score,
            average_clarity=avg_clarity,
            average_relevance=avg_relevance,
            average_structure=avg_structure,
            average_confidence=avg_conf,
            strongest_dimension=strongest,
            weakest_dimension=weakest,
            key_strengths=strengths,
            areas_for_improvement=weaknesses,
            personalized_recommendations=recommendations,
        )
