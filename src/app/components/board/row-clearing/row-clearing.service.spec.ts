import { TestBed } from '@angular/core/testing';
import { BoardService } from '../board-service/board.service';
import { Board, Row } from '../board-service/models';

import { RowClearingService } from './row-clearing.service';

describe('RowClearingService', () => {
  let service: RowClearingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService],
    });
    service = TestBed.inject(RowClearingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('keeps track of the rows cleared by the player', () => {
    const board: Board = new Array(10);
    const fullRow: Row = [{ solid: true, isPlayer: false, color: 'DarkBlue' }];
    board.fill(fullRow);
    service.clearFullRows(board);
    expect(service.rowsCleared).toBe(10);
  });
});
