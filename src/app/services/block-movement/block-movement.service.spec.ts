import { TestBed } from '@angular/core/testing';
import { BoardService } from 'src/app/components/board/board-service/board.service';

import { BlockMovementService } from './block-movement.service';

describe('BlockMovementService', () => {
  let service: BlockMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService],
    });
    service = TestBed.inject(BlockMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('does not break if you pass it out of bound values', () => {
    let inValid = service.isInvalidMove([], [{ x: 100, y: 0 }]);
    expect(inValid).toBeTrue();
    inValid = service.isInvalidMove([], [{ x: 0, y: 200 }]);
    expect(inValid).toBeTrue();
  });
});
