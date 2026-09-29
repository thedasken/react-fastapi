from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.projects.model import Project


class ProjectRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_paginated(self, page: int, page_size: int) -> tuple[list[Project], int]:
        items_result = await self.session.execute(
            select(Project)
            .order_by(Project.created_at, Project.id)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        total = await self.session.scalar(select(func.count()).select_from(Project))
        return list(items_result.scalars().all()), total or 0

    async def get(self, project_id: UUID) -> Project | None:
        return await self.session.get(Project, project_id)

    async def create(self, name: str, description: str | None) -> Project:
        project = Project(name=name, description=description)
        self.session.add(project)
        await self.session.commit()
        await self.session.refresh(project)
        return project

    async def update(
        self, project_id: UUID, values: dict[str, str | None]
    ) -> Project | None:
        project = await self.session.get(Project, project_id)
        if project is None:
            return None
        if not values:
            return project
        for field, value in values.items():
            setattr(project, field, value)
        await self.session.commit()
        await self.session.refresh(project)
        return project

    async def delete(self, project_id: UUID) -> bool:
        result = await self.session.execute(delete(Project).where(Project.id == project_id))
        await self.session.commit()
        return result.rowcount == 1
