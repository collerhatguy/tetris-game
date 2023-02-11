import { Injectable } from '@angular/core';
import { filter, map, tap } from 'rxjs';
import { Store } from 'src/app/utils/store';
import { Board, Row, Block, Square } from './models';

@Injectable({
  providedIn: 'root',
})
export class BoardService extends Store<Board> {
  readonly boardHeight = 20;
  readonly boardWidth = 10;

  private createEmptyBlock(): Square {
    return {
      solid: false,
      isPlayer: false,
      color: 'white',
    };
  }

  private createSolidBlock(): Square {
    return {
      solid: true,
      isPlayer: false,
      color: 'orange',
    };
  }

  private createShadowBlock(): Square {
    return {
      solid: false,
      isPlayer: false,
      color: 'orange',
    };
  }

  private createPlayerBlock(): Square {
    return {
      solid: true,
      isPlayer: true,
      color: 'orange',
    };
  }

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
        row.push(this.createEmptyBlock());
      }
    }
    return board;
  }

  lockPieceInplace(cordinates: Block) {
    const prevBoard = this.state;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = this.createSolidBlock();
    });
    this.setState(prevBoard);
  }

  movePiece(prev: Block, current: Block, type: 'player' | 'shadow' = 'player') {
    const prevBoard = this.state;
    prev.forEach((c) => {
      prevBoard[c.y][c.x] = this.createEmptyBlock();
    });
    current.forEach((c) => {
      prevBoard[c.y][c.x] =
        type === 'player' ? this.createPlayerBlock() : this.createShadowBlock();
    });
    this.setState(prevBoard);
  }

  private squareIsFull(square: Square) {
    return square.solid && !square.isPlayer;
  }

  private rowIsFull(row: Row) {
    return row.every((square) => this.squareIsFull(square));
  }

  private createEmptyRow() {
    const row: Row = new Array(this.boardWidth);
    row.fill(this.createEmptyBlock());
    return row;
  }

  private moveUpperRowsDown(board: Board, startingRowIndex: number) {
    for (let i = startingRowIndex; i >= 0; i--) {
      board[i].forEach((square, x) => {
        board[i + 1][x] = { ...square };
      });
    }
  }

  private clearRows(indexes: number[]) {
    const board = this.state;
    indexes.forEach((index) => {
      board[index] = this.createEmptyRow();
      const upperRowIndex = index - 1;
      this.moveUpperRowsDown(board, upperRowIndex);
    });
    board[0] = this.createEmptyRow();
    this.setState(board);
  }

  private getFullRowIndexes(board: Board) {
    return board.reduce(
      (fullRows: number[], row, index) =>
        this.rowIsFull(row) ? [...fullRows, index] : fullRows,
      []
    );
  }

  clearsFullRows = this.state$.pipe(
    map((board) => this.getFullRowIndexes(board)),
    filter((rows) => rows.length !== 0),
    tap((fullRows) => this.clearRows(fullRows))
  );
}
