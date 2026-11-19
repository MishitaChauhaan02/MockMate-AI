from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updated = AuthService.update_profile(db, current_user, update_data)
    return updated
