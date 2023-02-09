import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { log } from 'src/app/utils/operators';
import { Board, Row, Block, Square } from './models';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly boardHeight = 20;
  private readonly boardWidth = 10;
  private readonly emptyBlock: Square = Object.freeze({
    solid: false,
    isPlayer: false,
    color: 'white',
  });

  private readonly setBlock: Square = Object.freeze({
    solid: true,
    isPlayer: false,
    color: 'orange',
  });

  private readonly shadowBlock: Square = Object.freeze({
    solid: false,
    isPlayer: false,
    color: 'orange',
  });

  private readonly playerBlock: Square = Object.freeze({
    solid: true,
    isPlayer: true,
    color: 'orange',
  });

  private board = new BehaviorSubject<Board>(this.getInitialBoard());

  value$ = this.board.asObservable();

  get value() {
    return this.board.value;
  }

  private getInitialBoard(): Board {
    const board: Board = [];
    for (let i = 0; i < this.boardHeight; i++) {
      const row: Row = [];
      board.push(row);
      for (let j = 0; j < this.boardWidth; j++) {
        row.push({ ...this.emptyBlock });
      }
    }
    return board;
  }

  lockPieceInplace(cordinates: Block) {
    const prevBoard = this.value;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.setBlock };
    });
    this.board.next(prevBoard);
  }

  clearPiece(cordinates: Block) {
    const prevBoard = this.value;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.emptyBlock };
    });
    this.board.next(prevBoard);
  }
  setPlayerPiece(cordinates: Block) {
    const prevBoard = this.value;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.playerBlock };
    });
    this.board.next(prevBoard);
  }
  setShadowPiece(cordinates: Block) {
    const prevBoard = this.value;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.shadowBlock };
    });
    this.board.next(prevBoard);
  }
}
