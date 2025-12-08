import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.database.base import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    content = Column(Text, nullable=False)

    sentiment_score = Column(Float, nullable=True)  # -1 to 1
    sentiment_label = Column(String, nullable=True)  # "positive" / "neutral" / "negative"

    score = Column(Integer, default=0, nullable=False)  # cached vote score
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", backref="posts")
    votes = relationship("Vote", back_populates="post", cascade="all, delete-orphan")
    sentiment_entries = relationship(
        "Sentiment", back_populates="post", cascade="all, delete-orphan"
    )
