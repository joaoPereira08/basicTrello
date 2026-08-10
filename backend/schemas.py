from datetime import datetime
from typing import Optional, List as PyList
from pydantic import BaseModel


# Card
class CardBase(BaseModel):
    title: str
    description: Optional[str] = None
    position: int = 0


class CardCreate(CardBase):
    list_id: int


class CardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[int] = None
    list_id: Optional[int] = None


class Card(CardBase):
    id: int
    list_id: int

    class Config:
        from_attributes = True


# List
class ListBase(BaseModel):
    title: str
    position: int = 0


class ListCreate(ListBase):
    board_id: int


class ListUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = None


class List(ListBase):
    id: int
    board_id: int
    cards: PyList[Card] = []

    class Config:
        from_attributes = True


# Board
class BoardBase(BaseModel):
    title: str


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    title: Optional[str] = None


class Board(BoardBase):
    id: int
    created_at: datetime
    lists: PyList[List] = []

    class Config:
        from_attributes = True