import { TestBed } from '@angular/core/testing';
import { BoardService } from 'src/app/components/board/board-service/board.service';
import { BlockBuilder } from 'src/app/components/board/block-generation/model';
import { BlockMovementService } from './block-movement.service';

describe('BlockMovementService', () => {
  let service: BlockMovementService;
  let board: BoardService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService],
    });
    service = TestBed.inject(BlockMovementService);
    board = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('rotation', () => {
    it('can rotate a L block right', () => {
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
      expected.rotateRight();
      expect(newBlock).toEqual(expected);
    });
    it('can rotate a J block right', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockLeft()
        .done();
      const newBlock = service.getFuturePosition('rotateRight', block);
      const expected = new BlockBuilder({ x: 6, y: 1 })
        .addBlockLeft()
        .addBlockLeft()
        .addBlockAbove()
        .done();
      expected.rotateRight();
      expect(newBlock).toEqual(expected);
    });
    it('can rotate an L block left', () => {
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
      expected.rotateLeft();
      expect(newBlock).toEqual(expected);
    });
    it('will not change a square block', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockRight()
        .addBlockAbove()
        .done('O');
      const newBlock = service.getFuturePosition('rotateLeft', block);
      const expected = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockRight()
        .addBlockAbove()
        .done('O');
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
      expected.rotateRight();
      expect(newBlock).toEqual(expected);
    });
    it('rotating a block 4 times to the right results in the original block', () => {
      const block = new BlockBuilder({ x: 5, y: 5 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done();
      let newBlock = service.getFuturePosition('rotateRight', block);
      newBlock = service.getFuturePosition('rotateRight', newBlock);
      newBlock = service.getFuturePosition('rotateRight', newBlock);
      newBlock = service.getFuturePosition('rotateRight', newBlock);
      expect(newBlock).toEqual(block);
    });
    it('rotating a block 4 times to the left results in the original block', () => {
      const block = new BlockBuilder({ x: 5, y: 5 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done();
      let newBlock = service.getFuturePosition('rotateLeft', block);
      newBlock = service.getFuturePosition('rotateLeft', newBlock);
      newBlock = service.getFuturePosition('rotateLeft', newBlock);
      newBlock = service.getFuturePosition('rotateLeft', newBlock);
      expect(newBlock).toEqual(block);
    });
    describe('wall kicking', () => {
      it('if I rotate right and that postion is occuppied I will get the position immediatly left of that', () => {
        const block = new BlockBuilder({ x: 5, y: 5 })
          .addBlockBelow()
          .addBlockBelow()
          .addBlockLeft()
          .done();
        board.lockPieceInplace([{ x: 4, y: 5 }]);
        const newBlock = service.getFuturePosition('rotateRight', block);
        const expected = new BlockBuilder({ x: 5, y: 6 })
          .addBlockLeft()
          .addBlockLeft()
          .addBlockAbove()
          .done();
        expect(newBlock).toEqual(expected);
      });
      it('if the previous cases final value is impossible then I will get the position immediatly below that one', () => {
        const block = new BlockBuilder({ x: 5, y: 5 })
          .addBlockBelow()
          .addBlockBelow()
          .addBlockLeft()
          .done();
        board.lockPieceInplace([
          { x: 4, y: 5 },
          { x: 3, y: 5 },
        ]);
        const newBlock = service.getFuturePosition('rotateRight', block);
        const expected = new BlockBuilder({ x: 5, y: 7 })
          .addBlockLeft()
          .addBlockLeft()
          .addBlockAbove()
          .done();
        expect(newBlock).toEqual(expected);
      });
      it('rotating to the right will cause the blocks postion to change', () => {
        const block = new BlockBuilder({ x: 5, y: 5 })
          .addBlockBelow()
          .addBlockBelow()
          .addBlockRight()
          .done();
        let newBlock = service.getFuturePosition('rotateRight', block);
        expect(newBlock.position).toBe('R');
        newBlock = service.getFuturePosition('rotateRight', newBlock);
        expect(newBlock.position).toBe('2');
        newBlock = service.getFuturePosition('rotateRight', newBlock);
        expect(newBlock.position).toBe('L');
      });
      it('rotating left will not change the shape', () => {
        const block = new BlockBuilder({ x: 5, y: 5 })
          .addBlockBelow()
          .addBlockBelow()
          .addBlockRight()
          .done('L');
        const newBlock = service.getFuturePosition('rotateRight', block);
        expect(newBlock.shape).toBe('L');
      });
    });
  });
});
