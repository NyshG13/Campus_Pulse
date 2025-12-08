from datetime import datetime, timedelta

from app.db.models.post import Post


def compute_trending_score(post: Post) -> int:
    """
    Basic trending score.
    score = base_score - time_decay
    base_score = post.score (sum of votes)
    time_decay: + newer posts slightly favored
    """
    base_score = post.score

    # Simple time decay: subtract 1 point per day old
    days_old = (datetime.utcnow() - post.created_at).days
    time_bonus = max(0, 5 - days_old)  # posts <5 days get some boost

    return base_score + time_bonus
