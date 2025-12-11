#Holds the master list of all tables via Base. When create_tables() is called, this is what tells SQLAlchemy what tables to create.
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models here so Alembic / metadata can see them
from backend.database.models.user import User  # noqa
from backend.database.models.post import Post  # noqa
from backend.database.models.vote import Vote  # noqa
from backend.database.models.sentiment import Sentiment  # noqa
