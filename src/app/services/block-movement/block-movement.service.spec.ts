import { TestBed } from '@angular/core/testing';
import { BoardService } from 'src/app/components/board/board-service/board.service';
import { BlockBuilder } from 'src/app/components/board/block-generation/model';
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

  describe('rotation', () => {
    it('can rotate a 3 width block right', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockRight()
        .done();
      const newBlock = service.getFuturePosition('rotateRight', block);
      const expected = new BlockBuilder({ x: 6, y: 1 })
        .addBlockLeft()
        .addBlockLeft()
        .addBlockBelow()
        .done();
      expect(newBlock).toEqual(expected);
    });
  });
});
