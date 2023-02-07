import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board, Row, Coordinate } from './models';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly boardHeight = 20;
  private readonly boardWidth = 10;

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
        row.push({ color: 'white', isPlayer: false });
      }
    }
    return board;
  }

  lockPieceInplace(cordinates: Coordinate[]) {
    const prevBoard = this.value;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x].isPlayer = false;
    });
    this.board.next(prevBoard);
  }
  clearPiece(cordinates: Coordinate[]) {
    const prevBoard = this.value;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x].color = 'white';
      prevBoard[c.y][c.x].isPlayer = false;
    });
    this.board.next(prevBoard);
  }
  setPiece(cordinates: Coordinate[]) {
    const prevBoard = this.value;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x].color = 'orange';
      prevBoard[c.y][c.x].isPlayer = true;
    });
    this.board.next(prevBoard);
  }
}
