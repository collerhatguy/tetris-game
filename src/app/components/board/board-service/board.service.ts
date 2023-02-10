import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { log } from 'src/app/utils/operators';
import { Store } from 'src/app/utils/store';
import { Board, Row, Block, Square } from './models';

@Injectable({
  providedIn: 'root',
})
export class BoardService extends Store<Board> {
  readonly boardHeight = 20;
  readonly boardWidth = 10;
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

  constructor() {
    super([]);
    this.setState(this.getInitialBoard());
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
    const prevBoard = this.state;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.setBlock };
    });
    this.setState(prevBoard);
  }

  clearPiece(cordinates: Block) {
    const prevBoard = this.state;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.emptyBlock };
    });
    this.setState(prevBoard);
  }
  setPlayerPiece(cordinates: Block) {
    const prevBoard = this.state;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.playerBlock };
    });
    this.setState(prevBoard);
  }
  setShadowPiece(cordinates: Block) {
    const prevBoard = this.state;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.shadowBlock };
    });
    this.setState(prevBoard);
  }
}
