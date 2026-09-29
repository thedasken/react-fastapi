FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app/backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --locked --no-dev --no-install-project

COPY backend/src ./src
COPY backend/README.md ./
COPY backend/alembic.ini ./
COPY backend/alembic ./alembic

RUN uv sync --locked --no-dev

ENV PATH="/app/backend/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
