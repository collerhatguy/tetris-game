import { TestBed } from '@angular/core/testing';
import { BoardService } from 'src/app/components/board/board-service/board.service';
import {
  BlockBuilder,
  Tetronomo,
} from 'src/app/components/board/block-generation/model';
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
        .addBlockLeft()
        .addBlockLeft()
        .done('L');
      const newBlock = service.getFuturePosition('rotateRight', block);
      const expected = new BlockBuilder({ x: 5, y: 2 })
        .addBlockLeft()
        .addBlockAbove()
        .addBlockAbove()
        .done('L');
      expected.rotate('rotateRight');
      expect(newBlock).toEqual(expected);
    });
    it('can rotate a J block right', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockRight()
        .addBlockRight()
        .done('J');
      const newBlock = service.getFuturePosition('rotateRight', block);
      const expected = new BlockBuilder({ x: 7, y: 0 })
        .addBlockLeft()
        .addBlockBelow()
        .addBlockBelow()
        .done('J');
      expected.rotate('rotateRight');
      expect(newBlock).toEqual(expected);
    });
    it('can rotate an L block left', () => {
      const block = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockLeft()
        .addBlockLeft()
        .done('L');
      const newBlock = service.getFuturePosition('rotateLeft', block);
      const expected = new BlockBuilder({ x: 3, y: 0 })
        .addBlockRight()
        .addBlockBelow()
        .addBlockBelow()
        .done('L');
      expected.rotate('rotateLeft');
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
      expected.rotate('rotateRight');
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
  describe('replacing a block', () => {
    it('given 2 block its will replace the first block with the second block', () => {
      const tetroToReplace = new BlockBuilder({ x: 6, y: 6 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done('I');
      const newTetro = new BlockBuilder({ x: 0, y: 0 })
        .addBlockBelow()
        .addBlockLeftAndRight()
        .done('T');

      const expected = new BlockBuilder({ x: 6, y: 6 })
        .addBlockBelow()
        .addBlockLeftAndRight()
        .done('T');
      const res = service.replaceTetronome(tetroToReplace, newTetro);
      expect(res).toEqual(expected);
    });
  });
  describe('getLowestPoint', () => {
    it('does not run infinitly when an empty array is passed', () => {
      const res = service.getLowestPoint(new Tetronomo());
      expect(res).toEqual(new Tetronomo());
    });
  });
});
