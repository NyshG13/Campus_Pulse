#Ensures vote requests are valid and formatted correctly.
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field


# class VoteCreate(BaseModel):
#     post_id: UUID
#     device_hash: str
#     value: int = Field(..., description="1 for upvote, -1 for downvote")

class VoteCreate(BaseModel):
    post_id: str
    device_hash: str
    value: int

class VoteOut(BaseModel):
    id: UUID
    post_id: UUID
    value: int
    created_at: datetime

    class Config:
        orm_mode = True
