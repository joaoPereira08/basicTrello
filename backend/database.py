import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# Lê a connection string do .env. Se não existir, usa este valor por defeito
# (ajusta o utilizador/password/nome da BD conforme o que definiste no PostgreSQL).
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:a_tua_password@localhost:5432/minitrello"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()