import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board, Row } from '../board.component';

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

  set value(value: Board) {
    this.board.next(value);
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
}
