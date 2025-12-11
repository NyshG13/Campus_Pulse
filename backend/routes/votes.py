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

from backend.database.session import SessionLocal
from backend.database.models.user import User
from backend.database.models.post import Post
from backend.database.models.vote import Vote
from backend.schemas.vote import VoteCreate, VoteOut

router = APIRouter(prefix="/votes", tags=["votes"])


def get_db():
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


@router.post("/", response_model=VoteOut)
def cast_vote(payload: VoteCreate, db: Session = Depends(get_db)):
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
        # If same vote again, remove vote; else switch vote
        if existing_vote.value == payload.value:
            post.score -= existing_vote.value
            db.delete(existing_vote)
        else:
            post.score -= existing_vote.value
            existing_vote.value = payload.value
            post.score += payload.value
        db.commit()
        db.refresh(post)
        db.refresh(existing_vote)
        return existing_vote

    # New vote
    vote = Vote(post_id=payload.post_id, user_id=user.id, value=payload.value)
    post.score += payload.value

    db.add(vote)
    db.commit()
    db.refresh(post)
    db.refresh(vote)
    return vote
