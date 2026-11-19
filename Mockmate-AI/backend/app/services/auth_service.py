
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest
from app.schemas.user import UserUpdate
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class AuthService:

    @staticmethod
    def _normalize_email(email: str) -> str:
        return email.strip().lower()

    @staticmethod
    def register_user(db: Session, request: RegisterRequest) -> User:

        email = AuthService._normalize_email(request.email)

        existing = db.query(User).filter(
            User.email == email
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )

        new_user = User(
            full_name=request.full_name.strip(),
            email=email,
            hashed_password=hash_password(request.password),
        )

        try:
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            return new_user

        except IntegrityError:
            db.rollback()

            # Handles simultaneous registration attempts.
            existing = db.query(User).filter(
                User.email == email
            ).first()

            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="An account with this email already exists",
                )

            raise

        except Exception:
            db.rollback()
            raise

    @staticmethod
    def authenticate_user(
        db: Session,
        request: LoginRequest
    ) -> tuple[User, str]:

        email = AuthService._normalize_email(request.email)

        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user or not verify_password(
            request.password,
            user.hashed_password
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = create_access_token(subject=str(user.id))

        return user, token

    @staticmethod
    def update_profile(
        db: Session,
        user: User,
        update_data: UserUpdate
    ) -> User:

        if update_data.full_name is not None:
            new_name = update_data.full_name.strip()

            if new_name:
                user.full_name = new_name

        if update_data.new_password:

            if not update_data.current_password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is required",
                )

            if not verify_password(
                update_data.current_password,
                user.hashed_password
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is incorrect",
                )

            if update_data.new_password == update_data.current_password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="New password must be different",
                )

            user.hashed_password = hash_password(
                update_data.new_password
            )

        try:
            db.commit()
            db.refresh(user)
            return user

        except Exception:
            db.rollback()
            raise
