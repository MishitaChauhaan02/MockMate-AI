from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserBrief
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    user = AuthService.register_user(db, request)
    _, token = AuthService.authenticate_user(
        db, LoginRequest(email=request.email, password=request.password)
    )
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserBrief.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user, token = AuthService.authenticate_user(db, request)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserBrief.model_validate(user),
    )


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserBrief)
def get_me(current_user: User = Depends(get_current_user)):
    return UserBrief.model_validate(current_user)
