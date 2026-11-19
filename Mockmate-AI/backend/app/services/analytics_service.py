from typing import List, Dict
from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.answer import Answer
from app.models.evaluation import Evaluation
from app.schemas.analytics import (
    DashboardStats,
    TrendPoint,
    SkillPerformance,
    ProgressAnalytics,
)
from app.schemas.interview import InterviewResponse


class AnalyticsService:

    @staticmethod
    def get_dashboard_stats(db: Session, user_id: int) -> DashboardStats:
        interviews = (
            db.query(Interview)
            .filter(Interview.user_id == user_id)
            .order_by(Interview.started_at.desc())
            .all()
        )

        completed = [
            i for i in interviews
            if i.status == "completed" and i.overall_score is not None
        ]

        scores = [i.overall_score for i in completed]

        return DashboardStats(
            total_interviews=len(interviews),
            average_score=round(sum(scores) / len(scores), 2) if scores else 0.0,
            best_score=round(max(scores), 2) if scores else 0.0,
            total_questions_answered=(
                db.query(Answer)
                .join(Interview)
                .filter(Interview.user_id == user_id)
                .count()
            ),
            recent_interviews=[
                InterviewResponse.model_validate(i) for i in interviews[:5]
            ],
        )

    @staticmethod
    def get_progress_analytics(db: Session, user_id: int) -> ProgressAnalytics:
        completed = (
            db.query(Interview)
            .filter(
                Interview.user_id == user_id,
                Interview.status == "completed",
                Interview.overall_score.isnot(None),
            )
            .order_by(Interview.started_at.asc())
            .all()
        )

        if not completed:
            return ProgressAnalytics(
                overall_trend=[],
                dimension_averages={
                    "Clarity": 0.0,
                    "Relevance": 0.0,
                    "Structure": 0.0,
                    "Confidence": 0.0,
                },
                skill_profiles=[],
                strongest_skill=None,
                weakest_skill=None,
                recommendations=[
                    "Start your first practice interview to begin tracking performance analytics!"
                ],
            )

        trend_points = [
            TrendPoint(
                date=i.started_at.strftime("%b %d"),
                score=i.overall_score,
                category=i.category,
            )
            for i in completed
        ]

        evaluations = (
            db.query(Evaluation)
            .join(Answer)
            .join(Interview)
            .filter(
                Interview.user_id == user_id,
                Interview.status == "completed",
            )
            .all()
        )

        dimensions = ["Clarity", "Relevance", "Structure", "Confidence"]
        score_fields = [
            "clarity_score",
            "relevance_score",
            "structure_score",
            "confidence_score",
        ]

        dimension_averages = {}

        for dimension, field in zip(dimensions, score_fields):
            values = [getattr(e, field) for e in evaluations]
            dimension_averages[dimension] = (
                round(sum(values) / len(values), 2) if values else 0.0
            )

        category_scores: Dict[str, List[float]] = {}

        for interview in completed:
            category_scores.setdefault(interview.category, []).append(
                interview.overall_score
            )

        skill_profiles = [
            SkillPerformance(
                category=category,
                average_score=round(sum(scores) / len(scores), 2),
                interviews_count=len(scores),
            )
            for category, scores in category_scores.items()
        ]

        skill_profiles.sort(
            key=lambda skill: skill.average_score,
            reverse=True,
        )

        strongest_skill = skill_profiles[0].category
        weakest_skill = skill_profiles[-1].category

        recommendations = [
            f"Target '{weakest_skill}' practice sessions to improve your lower-scoring technical areas.",
            f"You show strong performance in '{strongest_skill}'. Keep reinforcing advanced topics.",
            "Practice phrasing concise topic sentences before elaborating on algorithms.",
        ]

        return ProgressAnalytics(
            overall_trend=trend_points,
            dimension_averages=dimension_averages,
            skill_profiles=skill_profiles,
            strongest_skill=strongest_skill,
            weakest_skill=weakest_skill,
            recommendations=recommendations,
        )