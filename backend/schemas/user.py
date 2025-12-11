#Validates user login/register data and protects sensitive info (like password).
#email must be valid, password must be valid (must contain caps, numbers etc)
#We don’t want the backend to send the password in the response even if the frontend requests it. Schemas are the rule-book that ensures only allowed fields are sent.
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
