from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Board(Base):
    __tablename__ = "Boards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lists = relationship(
        "List", back_populates="board", cascade="all, delete-orphan"
    )


class List(Base):
    __tablename__ = "Lists"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    position = Column(Integer, nullable=False, default=0)
    board_id = Column(Integer, ForeignKey("Boards.id"), nullable=False)

    board = relationship("Board", back_populates="lists")
    cards = relationship(
        "Card", back_populates="list", cascade="all, delete-orphan"
    )


class Card(Base):
    __tablename__ = "Cards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    position = Column(Integer, nullable=False, default=0)
    list_id = Column(Integer, ForeignKey("Lists.id"), nullable=False)

    list = relationship("List", back_populates="cards")