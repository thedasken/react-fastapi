from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


def _validate_name(value: str) -> str:
    if value is None:
        raise ValueError("name must not be null")
    value = value.strip()
    if not value:
        raise ValueError("name must not be blank")
    return value


class ProjectCreate(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=5000)

    _name_not_blank = field_validator("name")(_validate_name)


class ProjectPatch(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=5000)

    _name_not_blank = field_validator("name")(_validate_name)

    @model_validator(mode="after")
    def reject_null_name(self) -> "ProjectPatch":
        if "name" in self.model_fields_set and self.name is None:
            raise ValueError("name must not be null")
        return self


class ProjectBulkDelete(BaseModel):
    ids: list[UUID] = Field(min_length=1)


class ProjectBulkDeleteResponse(BaseModel):
    deleted: int


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime
