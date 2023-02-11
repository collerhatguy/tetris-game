import { TestBed } from '@angular/core/testing';
import { BoardService } from '../board-service/board.service';

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
});
