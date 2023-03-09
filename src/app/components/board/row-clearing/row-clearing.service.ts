import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardService } from '../board-service/board.service';
import { Board, createEmptyBlock, Row, Square } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class RowClearingService {
  constructor(private injector: Injector) {}

  private squareIsFull(square: Square) {
    return square.solid && !square.isPlayer;
  }

  private rowIsFull(row: Row) {
    return row.every((square) => this.squareIsFull(square));
  }

  private createEmptyRow() {
    const board = this.injector.get(BoardService);
    const row: Row = new Array(board.boardWidth);
    row.fill(createEmptyBlock());
    return row;
  }

  private moveUpperRowsDown(board: Board, startingRowIndex: number) {
    for (let i = startingRowIndex; i >= 0; i--) {
      board[i].forEach((square, x) => {
        board[i + 1][x] = { ...square };
      });
    }
  }

  private clearRows(indexes: number[], board: Board) {
    indexes.forEach((index) => {
      board[index] = this.createEmptyRow();
      const upperRowIndex = index - 1;
      this.moveUpperRowsDown(board, upperRowIndex);
    });
    board[0] = this.createEmptyRow();
    return board;
  }

  private getFullRowIndexes(board: Board) {
    return board.reduce(
      (fullRows: number[], row, index) =>
        this.rowIsFull(row) ? [...fullRows, index] : fullRows,
      []
    );
  }

  private _rowsCleared$ = new BehaviorSubject(0);

  rowsCleared$ = this._rowsCleared$.asObservable();

  get rowsCleared() {
    return this._rowsCleared$.value;
  }

  clearFullRows(board: Board) {
    const fullRowIndexes = this.getFullRowIndexes(board);
    if (fullRowIndexes.length === 0) return board;
    this._rowsCleared$.next(this.rowsCleared + fullRowIndexes.length);
    return this.clearRows(fullRowIndexes, board);
  }
}
