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
    it('can rotate a 3 width block left', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockRight()
        .done();
      const newBlock = service.getFuturePosition('rotateLeft', block);
      const expected = new BlockBuilder({ x: 4, y: 1 })
        .addBlockRight()
        .addBlockRight()
        .addBlockAbove()
        .done();
      expect(newBlock).toEqual(expected);
    });
    it('will not change a square block', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockRight()
        .addBlockAbove()
        .done();
      const newBlock = service.getFuturePosition('rotateLeft', block);
      const expected = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockRight()
        .addBlockAbove()
        .done();
      expect(newBlock).toEqual(expected);
    });
    it('can rotate the line block', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done();
      const newBlock = service.getFuturePosition('rotateRight', block);
      const expected = new BlockBuilder({ x: 6, y: 1 })
        .addBlockLeft()
        .addBlockLeft()
        .addBlockLeft()
        .done();
      expect(newBlock).toEqual(expected);
    });
  });
});
