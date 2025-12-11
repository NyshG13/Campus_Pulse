# glues together config, DB, and routes, and exposes the app that handles every request.
from fastapi import FastAPI

from backend.config import settings
from backend.database.base import Base
from backend.database.session import engine
from backend.routes import posts, votes


def create_tables():
    Base.metadata.create_all(bind=engine)


def get_application() -> FastAPI:
    app = FastAPI(title=settings.PROJECT_NAME)

    app.include_router(posts.router, prefix=settings.API_V1_STR)
    app.include_router(votes.router, prefix=settings.API_V1_STR)

    return app


create_tables()
app = get_application()
