# Backend

## Tech stack

- Python 3.12+
- FastAPI with Uvicorn
- Pydantic Settings for configuration
- SQLAlchemy 2 async ORM with `asyncpg`
- PostgreSQL
- Alembic for database migrations
- Loguru for application logging
- `uv` for dependency and environment management

## Local setup

From the `backend/` directory:

```bash
uv sync
```

Copy or create the root `.env` file from `.env.example`, then start PostgreSQL from the repository root:

```bash
docker compose up -d db
```

Start the development server:

```bash
uv run uvicorn backend.main:app --reload
```

The API is available at `http://localhost:8000`.

## Health checks

```bash
curl http://localhost:8000/health
curl http://localhost:8000/health/ready
```

`/health` checks that the application is serving requests. `/health/ready` also checks database connectivity. These endpoints are intentionally excluded from the OpenAPI/Swagger schema.

## Database migrations

Alembic reads `DATABASE_URL` from the application settings and uses the async PostgreSQL driver.

Check the current migration revision:

```bash
uv run alembic current
```

List migration history:

```bash
uv run alembic history
```

Create a migration from SQLAlchemy metadata after adding models:

```bash
uv run alembic revision --autogenerate -m "describe the schema change"
```

Review generated migrations before applying them, then upgrade the database:

```bash
uv run alembic upgrade head
```

Upgrade to a specific revision:

```bash
uv run alembic upgrade <revision>
```

Downgrade one revision:

```bash
uv run alembic downgrade -1
```

Generate SQL without applying it:

```bash
uv run alembic upgrade head --sql
```

When models are added, import them in `alembic/env.py` and set `target_metadata` to the shared SQLAlchemy metadata before using `--autogenerate`.

## Useful commands

Compile-check the backend:

```bash
uv run python -m compileall -q src
```

Inspect installed dependency consistency:

```bash
uv lock --check
```

Stop the local database:

```bash
docker compose stop db
```

Remove the database container and its stored data:

```bash
docker compose down -v
```
