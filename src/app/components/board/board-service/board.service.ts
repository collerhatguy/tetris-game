import { Injectable } from '@angular/core';
import { Store } from 'src/app/utils/store';
import { Tetronomo } from '../block-generation/model';
import { RowClearingService } from '../row-clearing/row-clearing.service';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import {
  Board,
  Row,
  Block,
  createEmptyBlock,
  createPlayerBlock,
  createShadowBlock,
  createSolidBlock,
} from './models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService extends Store<Board> {
  readonly hiddenRows = 4;
  readonly boardHeight = 20 + this.hiddenRows;
  readonly boardWidth = 10;

  constructor(
    private rowClearing: RowClearingService,
    private movement: BlockMovementService
  ) {
    super([]);
    this.setState(this.getInitialBoard());
  }

  private setBoardWithRowClearing(board: Board) {
    const clearedBoard = this.rowClearing.clearFullRows(board);
    this.setState(clearedBoard);
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

  lockPieceInplace(cordinates: Tetronomo) {
    const prevBoard = this.state;
    cordinates.forEach((c) => {
      prevBoard[c.y][c.x] = createSolidBlock(cordinates.shape);
    });
    this.setBoardWithRowClearing(prevBoard);
  }

  movePiece(prev: Tetronomo, current: Tetronomo) {
    const prevBoard = this.state;
    prev.forEach((c) => {
      prevBoard[c.y][c.x] = createEmptyBlock();
    });
    const prevShadow = this.movement.getLowestPoint(prev);
    prevShadow.forEach((c) => {
      prevBoard[c.y][c.x] = createEmptyBlock();
    });

    const currentShadow = this.movement.getLowestPoint(current);
    currentShadow.forEach((c) => {
      prevBoard[c.y][c.x] = createShadowBlock(current.shape);
    });
    current.forEach((c) => {
      prevBoard[c.y][c.x] = createPlayerBlock(current.shape);
    });

    this.setState(prevBoard);
  }

  shownBoard = this.state$.pipe(
    map((wholeBoard) => wholeBoard.slice(this.hiddenRows))
  );
}
