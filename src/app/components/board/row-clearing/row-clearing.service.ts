import { Injectable } from '@angular/core';
import { filter, map, tap } from 'rxjs';
import { BoardService } from '../board-service/board.service';
import { Board, createEmptyBlock, Row, Square } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class RowClearingService {
  private squareIsFull(square: Square) {
    return square.solid && !square.isPlayer;
  }

  private rowIsFull(row: Row) {
    return row.every((square) => this.squareIsFull(square));
  }

  private createEmptyRow() {
    const row: Row = new Array(this.board.boardWidth);
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

  private clearRows(indexes: number[]) {
    const board = this.board.state;
    indexes.forEach((index) => {
      board[index] = this.createEmptyRow();
      const upperRowIndex = index - 1;
      this.moveUpperRowsDown(board, upperRowIndex);
    });
    board[0] = this.createEmptyRow();
    this.board.setState(board);
  }

  private getFullRowIndexes(board: Board) {
    return board.reduce(
      (fullRows: number[], row, index) =>
        this.rowIsFull(row) ? [...fullRows, index] : fullRows,
      []
    );
  }

  clearsFullRows = this.board.state$.pipe(
    map((board) => this.getFullRowIndexes(board)),
    filter((rows) => rows.length !== 0),
    tap((fullRows) => this.clearRows(fullRows))
  );
  constructor(private board: BoardService) {}
}
