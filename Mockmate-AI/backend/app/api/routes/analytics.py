from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.analytics import DashboardStats, ProgressAnalytics, SkillPerformance
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return AnalyticsService.get_dashboard_stats(db, current_user.id)


@router.get("/progress", response_model=ProgressAnalytics)
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return AnalyticsService.get_progress_analytics(db, current_user.id)


@router.get("/skill-performance", response_model=List[SkillPerformance])
def get_skill_performance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = AnalyticsService.get_progress_analytics(db, current_user.id)
    return progress.skill_profiles
