#to let api talk to database 
#every time there is a request, this 'engine' is used to connect to database 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
