from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.session import SessionLocal
from backend.database.models.post import Post
from backend.database.models.user import User
from backend.database.models.sentiment import Sentiment
from backend.schemas.post import PostCreate, PostOut
from backend.services.sentiment_service import analyze_text

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
    posts = (
        db.query(Post)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return posts
