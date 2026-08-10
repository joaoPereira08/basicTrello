from sqlalchemy.orm import Session

import models
import schemas


# Board
def get_boards(db: Session):
    return db.query(models.Board).all()


def get_board(db: Session, board_id: int):
    return db.query(models.Board).filter(models.Board.id == board_id).first()


def create_board(db: Session, board: schemas.BoardCreate):
    db_board = models.Board(title=board.title)
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board


def update_board(db: Session, board_id: int, board: schemas.BoardUpdate):
    db_board = get_board(db, board_id)
    if not db_board:
        return None
    for key, value in board.dict(exclude_unset=True).items():
        setattr(db_board, key, value)
    db.commit()
    db.refresh(db_board)
    return db_board


def delete_board(db: Session, board_id: int):
    db_board = get_board(db, board_id)
    if not db_board:
        return None
    db.delete(db_board)
    db.commit()
    return db_board



def get_lists_by_board(db: Session, board_id: int):
    return db.query(models.List).filter(models.List.board_id == board_id).all()


def get_list(db: Session, list_id: int):
    return db.query(models.List).filter(models.List.id == list_id).first()


def create_list(db: Session, lst: schemas.ListCreate):
    db_list = models.List(**lst.dict())
    db.add(db_list)
    db.commit()
    db.refresh(db_list)
    return db_list


def update_list(db: Session, list_id: int, lst: schemas.ListUpdate):
    db_list = get_list(db, list_id)
    if not db_list:
        return None
    for key, value in lst.dict(exclude_unset=True).items():
        setattr(db_list, key, value)
    db.commit()
    db.refresh(db_list)
    return db_list


def delete_list(db: Session, list_id: int):
    db_list = get_list(db, list_id)
    if not db_list:
        return None
    db.delete(db_list)
    db.commit()
    return db_list


def get_cards_by_board(db: Session, board_id: int):
    return (
        db.query(models.Card)
        .join(models.List)
        .filter(models.List.board_id == board_id)
        .all()
    )


def get_card(db: Session, card_id: int):
    return db.query(models.Card).filter(models.Card.id == card_id).first()


def create_card(db: Session, card: schemas.CardCreate):
    db_card = models.Card(**card.dict())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


def update_card(db: Session, card_id: int, card: schemas.CardUpdate):
    db_card = get_card(db, card_id)
    if not db_card:
        return None
    for key, value in card.dict(exclude_unset=True).items():
        setattr(db_card, key, value)
    db.commit()
    db.refresh(db_card)
    return db_card


def delete_card(db: Session, card_id: int):
    db_card = get_card(db, card_id)
    if not db_card:
        return None
    db.delete(db_card)
    db.commit()
    return db_card