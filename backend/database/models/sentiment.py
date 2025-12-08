import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.database.base import Base


class Sentiment(Base):
    __tablename__ = "sentiments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False)

    label = Column(String, nullable=False)   # "positive" / "neutral" / "negative"
    score = Column(Float, nullable=False)    # raw sentiment score/confidence

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    post = relationship("Post", back_populates="sentiment_entries")
