
from datetime import datetime, timedelta, timezone
from typing import Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerificationError
from jose import jwt, JWTError

from app.core.config import settings


# Password hashing using Argon2id
password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Securely hash a user's password."""

    if not password:
        raise ValueError("Password cannot be empty")

    return password_hasher.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """Verify a password against its stored Argon2 hash."""

    try:
        return password_hasher.verify(
            hashed_password,
            plain_password
        )

    except VerificationError:
        return False


def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a signed JWT access token."""

    if not subject:
        raise ValueError("Token subject cannot be empty")

    now = datetime.now(timezone.utc)

    expire = now + (
        expires_delta
        if expires_delta is not None
        else timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": str(subject),
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def decode_token(token: str) -> Optional[str]:
    """Validate JWT and return its subject."""

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require_exp": True, "require_sub": True}
        )

        user_id = payload.get("sub")

        if not isinstance(user_id, str) or not user_id:
            return None

        return user_id

    except JWTError:
        return None
