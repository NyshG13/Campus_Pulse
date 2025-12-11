#schema ensures that only valid post data enters from the frontend, and valid data goes out from backend. 
#Controls what data a post must contain when created or returned.
#ensures backend sends the data in correct/clean way. 
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field


class PostBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class PostCreate(PostBase):
    device_hash: str  # we will use this to resolve/create user


class PostOut(BaseModel):
    id: UUID
    content: str
    created_at: datetime
    score: int
    sentiment_score: float | None = None
    sentiment_label: str | None = None

    class Config:
        orm_mode = True
