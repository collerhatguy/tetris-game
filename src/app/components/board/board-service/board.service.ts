import { Injectable } from '@angular/core';
import { filter, map, tap } from 'rxjs';
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

  movePiece(prev: Block, current: Block, type: 'player' | 'shadow' = 'player') {
    const prevBoard = this.state;
    prev.forEach((c) => {
      prevBoard[c.y][c.x] = { ...this.emptyBlock };
    });
    current.forEach((c) => {
      prevBoard[c.y][c.x] = {
        ...(type === 'player' ? this.playerBlock : this.shadowBlock),
      };
    });
    this.setState(prevBoard);
  }

  private rowIsFull(row: Row) {
    return row.every((square) => square.solid && !square.isPlayer);
  }

  private createEmptyRow() {
    const row: Row = new Array(this.boardWidth);
    row.fill({ ...this.emptyBlock });
    return row;
  }

  private clearRows(indexes: number[]) {
    const board = this.state;
    indexes.forEach((index) => {
      board[index] = this.createEmptyRow();
      const upperRowIndex = index - 1;
      for (let i = upperRowIndex; i >= 0; i--) {
        // move each piece down one spot
        board[i].forEach((square, x) => {
          board[i + 1][x] = { ...square };
        });
        board[i] = this.createEmptyRow();
      }
    });
    this.setState(board);
  }

  clearsFullRows = this.state$.pipe(
    map((board) =>
      board.reduce(
        (fullRows: number[], row, index) =>
          this.rowIsFull(row) ? [...fullRows, index] : fullRows,
        []
      )
    ),
    filter((rows) => rows.length !== 0),
    tap((fullRows) => this.clearRows(fullRows.reverse()))
  );
}
