import { Injectable } from '@angular/core';
import { Store } from 'src/app/utils/store';
import {
  Board,
  Row,
  Block,
  createEmptyBlock,
  createPlayerBlock,
  createShadowBlock,
  createSolidBlock,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class BoardService extends Store<Board> {
  readonly boardHeight = 20;
  readonly boardWidth = 10;

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
        row.push(createEmptyBlock());
      }
    }
    return board;
  }

  lockPieceInplace(cordinates: Block) {
    const prevBoard = this.state;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = createSolidBlock();
    });
    this.setState(prevBoard);
  }

  movePiece(prev: Block, current: Block, type: 'player' | 'shadow' = 'player') {
    const prevBoard = this.state;
    prev.forEach((c) => {
      prevBoard[c.y][c.x] = createEmptyBlock();
    });
    current.forEach((c) => {
      prevBoard[c.y][c.x] =
        type === 'player' ? createPlayerBlock() : createShadowBlock();
    });
    this.setState(prevBoard);
  }
}
