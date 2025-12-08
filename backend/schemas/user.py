from uuid import UUID
from datetime import datetime

from pydantic import BaseModel


class UserBase(BaseModel):
    device_hash: str


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        orm_mode = True
