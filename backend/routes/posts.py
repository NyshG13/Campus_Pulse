#models define what exists, routes define what users are allowed to do with those things 
#contains a list of all the actions people can do with posts- create, delete, view 1 post, view all posts 
# it takes the user input and update the database accordingly, decides which function to call to update and work on that request 
# Example 1: Creating a post
# User clicks “Submit Post” in frontend.
# Frontend sends a request to backend: POST /api/v1/posts
# routes/post.py receives that request. It validates the data (e.g. using Pydantic schemas).
# It creates a new row in the Post table.
# Database stores it.
# Backend responds with JSON:
# {
#   "id": 42,
#   "content": "Hostel food sucks ",
#   "created_at": "..."
# }
# Frontend displays it.


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.session import SessionLocal
from backend.database.models.post import Post
from backend.database.models.user import User
from backend.database.models.sentiment import Sentiment
from backend.schemas.post import PostCreate, PostOut
from backend.services.sentiment_service import analyze_text
from sqlalchemy import func
from backend.database.models.vote import Vote


router = APIRouter(prefix="/posts", tags=["posts"])


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


@router.post("/", response_model=PostOut, status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, db: Session = Depends(get_db)):
    user = get_or_create_user(db, payload.device_hash)

    sentiment_label, sentiment_score = analyze_text(payload.content)

    post = Post(
        user_id=user.id,
        content=payload.content,
        sentiment_label=sentiment_label,
        sentiment_score=sentiment_score,
        score=0,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    sentiment_entry = Sentiment(
        post_id=post.id,
        label=sentiment_label,
        score=sentiment_score,
    )
    db.add(sentiment_entry)
    db.commit()

    return post


@router.get("/", response_model=list[PostOut])
def list_posts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    # 1) load posts (paged)
    posts = (
        db.query(Post)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    if not posts:
        return posts

    # 2) aggregate vote values for all posts in one query (sum of Vote.value)
    post_ids = [p.id for p in posts]
    agg = (
        db.query(
            Vote.post_id,
            func.coalesce(func.sum(Vote.value), 0).label("score"),
            func.count().filter(Vote.value == 1).label("upvotes"),
            func.count().filter(Vote.value == -1).label("downvotes"),
        )
        .filter(Vote.post_id.in_(post_ids))
        .group_by(Vote.post_id)
        .all()
    )
    # agg is list of tuples: (post_id, score)
    vote_map = {
        row.post_id: {
            "score": int(row.score),
            "upvotes": int(row.upvotes),
            "downvotes": int(row.downvotes),
        }
        for row in agg
    }

    # 3) attach computed score to each Post instance (so response uses up-to-date values)
    for p in posts:
        v = vote_map.get(p.id, {"score": 0, "upvotes": 0, "downvotes": 0})
        p.score = v["score"]
        p.upvotes = v["upvotes"]
        p.downvotes = v["downvotes"]

    return posts

