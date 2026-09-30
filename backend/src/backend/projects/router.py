from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.config import settings
from backend.core.database import get_db_session
from backend.core.schemas import Page
from backend.projects.repository import ProjectRepository
from backend.projects.schemas import (
    ProjectBulkDelete,
    ProjectBulkDeleteResponse,
    ProjectCreate,
    ProjectPatch,
    ProjectResponse,
)


router = APIRouter(prefix="/api/projects", tags=["projects"])


def get_repository(session: AsyncSession = Depends(get_db_session)) -> ProjectRepository:
    return ProjectRepository(session)


@router.get("", response_model=Page[ProjectResponse])
async def list_projects(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=settings.PAGINATION_DEFAULT_PAGE_SIZE, ge=1, le=100),
    search: str | None = Query(default=None),
    repository: ProjectRepository = Depends(get_repository),
) -> Page[ProjectResponse]:
    search = search.strip() if search else None
    items, total = await repository.list_paginated(page, page_size, search)
    return Page(items=items, page=page, page_size=page_size, total=total)


@router.delete("", response_model=ProjectBulkDeleteResponse)
async def delete_projects(
    payload: ProjectBulkDelete, repository: ProjectRepository = Depends(get_repository)
) -> ProjectBulkDeleteResponse:
    return ProjectBulkDeleteResponse(deleted=await repository.delete_many(payload.ids))


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID, repository: ProjectRepository = Depends(get_repository)
):
    project = await repository.get(project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate, repository: ProjectRepository = Depends(get_repository)
):
    return await repository.create(payload.name, payload.description)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: UUID,
    payload: ProjectPatch,
    repository: ProjectRepository = Depends(get_repository),
):
    values = payload.model_dump(exclude_unset=True)
    if not values:
        project = await repository.get(project_id)
    else:
        project = await repository.update(project_id, values)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID, repository: ProjectRepository = Depends(get_repository)
) -> Response:
    if not await repository.delete(project_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
