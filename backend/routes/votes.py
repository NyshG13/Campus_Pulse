#Example 2 - Upvoting a post
# User presses 👍 on a post.
# Frontend sends:
# POST /api/v1/votes
# {
#   "post_id": 42,
#   "direction": 1
# }
# routes/vote.py checks if the user already voted.
# If not → add a row to Vote table.
# If yes → update/remove it.
# Backend responds with updated count or status: { "message": "Vote registered", "total_votes": 17 }
# Frontend updates the UI (vote count increases).

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Generator

from backend.database.session import SessionLocal
from backend.database.models.user import User
from backend.database.models.post import Post
from backend.database.models.vote import Vote
from backend.schemas.vote import VoteCreate  # pydantic input schema

router = APIRouter(prefix="/api/v1/votes", tags=["votes"])


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_or_create_user(db: Session, device_hash: str) -> User:
    user = db.query(User).filter(User.device_hash == device_hash).first()
    if user:
        return user
    user = User(device_hash=device_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/", response_model=dict)
def cast_vote(payload: VoteCreate, db: Session = Depends(get_db)):
    """
    Create or update a vote for a post by an anonymous device (device_hash).
    Returns aggregated totals for the post:
    { post_id, votes, upvotes, downvotes }
    """

    if payload.value not in (1, -1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vote value must be 1 or -1",
        )

    user = get_or_create_user(db, payload.device_hash)

    post = db.query(Post).filter(Post.id == payload.post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_vote = (
        db.query(Vote)
        .filter(Vote.post_id == payload.post_id, Vote.user_id == user.id)
        .first()
    )

    if existing_vote:
        if existing_vote.value == payload.value:
            # no change — ensure post is fresh
            db.refresh(post)
        else:
            delta = payload.value - existing_vote.value
            existing_vote.value = payload.value
            if hasattr(post, "score"):
                post.score = (post.score or 0) + delta
            db.add(existing_vote)
            db.add(post)
            db.commit()
            db.refresh(post)
            db.refresh(existing_vote)
    else:
        vote = Vote(post_id=payload.post_id, user_id=user.id, value=payload.value)
        if hasattr(post, "score"):
            post.score = (post.score or 0) + payload.value
        db.add(vote)
        db.add(post)
        db.commit()
        db.refresh(post)
        db.refresh(vote)

    # compute aggregates from Vote table (authoritative)
    total_score = db.query(func.coalesce(func.sum(Vote.value), 0)).filter(Vote.post_id == payload.post_id).scalar() or 0
    upvotes = db.query(func.count()).filter(Vote.post_id == payload.post_id, Vote.value == 1).scalar() or 0
    downvotes = db.query(func.count()).filter(Vote.post_id == payload.post_id, Vote.value == -1).scalar() or 0

    return {
        "post_id": payload.post_id,
        "votes": int(total_score),
        "upvotes": int(upvotes),
        "downvotes": int(downvotes),
    }
