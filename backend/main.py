from typing import List as PyList
import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import crud
from database import engine, get_db


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="trello clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"https://.*\.basictrello\.pages\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/boards/", response_model=PyList[schemas.Board])
def read_boards(db: Session = Depends(get_db)):
    return crud.get_boards(db)


@app.post("/boards/", response_model=schemas.Board)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    return crud.create_board(db, board)


@app.get("/boards/{board_id}", response_model=schemas.Board)
def read_board(board_id: int, db: Session = Depends(get_db)):
    db_board = crud.get_board(db, board_id)
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    return db_board


@app.patch("/boards/{board_id}", response_model=schemas.Board)
def update_board(board_id: int, board: schemas.BoardUpdate, db: Session = Depends(get_db)):
    db_board = crud.update_board(db, board_id, board)
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    return db_board


@app.delete("/boards/{board_id}")
def delete_board(board_id: int, db: Session = Depends(get_db)):
    db_board = crud.delete_board(db, board_id)
    if not db_board:
        raise HTTPException(status_code=404, detail="Board not found")
    return {"ok": True}


@app.get("/boards/{board_id}/lists/", response_model=PyList[schemas.List])
def read_lists(board_id: int, db: Session = Depends(get_db)):
    return crud.get_lists_by_board(db, board_id)


@app.post("/lists/", response_model=schemas.List)
def create_list(lst: schemas.ListCreate, db: Session = Depends(get_db)):
    return crud.create_list(db, lst)


@app.patch("/lists/{list_id}", response_model=schemas.List)
def update_list(list_id: int, lst: schemas.ListUpdate, db: Session = Depends(get_db)):
    db_list = crud.update_list(db, list_id, lst)
    if not db_list:
        raise HTTPException(status_code=404, detail="List not found")
    return db_list


@app.delete("/lists/{list_id}")
def delete_list(list_id: int, db: Session = Depends(get_db)):
    db_list = crud.delete_list(db, list_id)
    if not db_list:
        raise HTTPException(status_code=404, detail="List not found")
    return {"ok": True}


@app.get("/boards/{board_id}/cards/", response_model=PyList[schemas.Card])
def read_cards(board_id: int, db: Session = Depends(get_db)):
    return crud.get_cards_by_board(db, board_id)


@app.get("/cards/{card_id}", response_model=schemas.Card)
def read_card(card_id: int, db: Session = Depends(get_db)):
    db_card = crud.get_card(db, card_id)
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@app.post("/cards/", response_model=schemas.Card)
def create_card(card: schemas.CardCreate, db: Session = Depends(get_db)):
    return crud.create_card(db, card)


@app.put("/cards/{card_id}", response_model=schemas.Card)
def replace_card(card_id: int, card: schemas.CardCreate, db: Session = Depends(get_db)):
    db_card = crud.update_card(db, card_id, schemas.CardUpdate(**card.dict()))
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@app.patch("/cards/{card_id}", response_model=schemas.Card)
def update_card(card_id: int, card: schemas.CardUpdate, db: Session = Depends(get_db)):
    db_card = crud.update_card(db, card_id, card)
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@app.delete("/cards/{card_id}")
def delete_card(card_id: int, db: Session = Depends(get_db)):
    db_card = crud.delete_card(db, card_id)
    if not db_card:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"ok": True}