from datetime import UTC, datetime, timedelta

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from backend.core.config import settings

ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_access_token(username: str) -> str:
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.AUTH_JWT_EXPIRE_MINUTES)
    return jwt.encode({"sub": username, "exp": expires_at}, settings.AUTH_JWT_SECRET, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.AUTH_JWT_SECRET, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not isinstance(username, str) or username != settings.AUTH_ADMIN_USERNAME:
            raise credentials_exception
    except (JWTError, ValueError) as error:
        raise credentials_exception from error
    return username
