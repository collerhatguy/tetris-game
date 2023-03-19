import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { BoardService } from '../board-service/board.service';

import { BlockGenerationService } from './block-generation.service';
import { BlockBuilder, Tetronomo } from './model';

describe('BlockGenerationService', () => {
  let service: BlockGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BoardService, useValue: { boardWidth: 10 } }],
    });
    service = TestBed.inject(BlockGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generates a random block', () => {
    const block1 = service.getNextBlock();
    const block2 = service.getNextBlock();
    expect(block1).not.toEqual(block2);
  });

  it('will always create the blocks in the "0" position', () => {
    const firstIterationOfBlocks = [];
    for (let i = 0; i < 7; i++) {
      firstIterationOfBlocks.push(service.getNextBlock());
    }
    expect(firstIterationOfBlocks.every((t) => t.position === '0')).toBeTrue();
  });

  it('will show a preview of the next blocks', () => {
    const spy = subscribeSpyTo(service.teronomoPreview);
    const nextBlocks = spy.getFirstValue();
    for (let i = 0; i < 6; i++) {
      const nextBlock = service.getNextBlock();
      expect(nextBlock.shape).toEqual(nextBlocks[i]);
    }
    spy.unsubscribe();
  });

  it('preview is updated whenever the next block is created', () => {
    const spy = subscribeSpyTo(service.teronomoPreview);
    service.getNextBlock();
    const nextBlocks = spy.getLastValue()!;

    for (let i = 0; i < 6; i++) {
      const nextBlock = service.getNextBlock();
      expect(nextBlock.shape).toEqual(nextBlocks[i]);
    }
    spy.unsubscribe();
  });

  describe('caching', () => {
    it('I can cache a piece and have a random block returned to me', () => {
      const spy = subscribeSpyTo(service.teronomoPreview);
      const [nextBlock] = spy.getFirstValue();
      const tetro = new Tetronomo({ x: 0, y: 0 });
      const newTetro = service.swapBlock(tetro);
      expect(newTetro.shape).toBe(nextBlock);
      spy.unsubscribe();
    });
    it('if I call the swap block functon again I will get the original tetro', () => {
      const LBlock = new BlockBuilder({ x: 5, y: 0 })
        .addBlockRight()
        .addBlockRight()
        .addBlockRight()
        .done('I');
      service.swapBlock(LBlock);
      const newTetro = service.getNextBlock();
      const orignal = service.swapBlock(newTetro);
      expect(orignal).toEqual(LBlock);
    });
    it('if I call the swap block function the returned block will match the position of the original but not the shape', () => {
      const spy = subscribeSpyTo(service.teronomoPreview);
      const [nextBlock] = spy.getFirstValue();
      const expectedStart = { x: 5, y: 6 };
      const IBlock = new BlockBuilder(expectedStart)
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done('I');
      const newTetro = service.swapBlock(IBlock);
      expect(newTetro[0]).toEqual(expectedStart);
      expect(newTetro.shape).toBe(nextBlock);
      spy.unsubscribe();
    });
    it('will always return the last tetronome passed to it after the first', () => {
      const OBlock = new BlockBuilder({ x: 5, y: 6 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done('O');

      service.swapBlock(OBlock);
      const nextBlock = service.getNextBlock();
      service.swapBlock(nextBlock);
      service.getNextBlock();
      const res = service.swapBlock(new Tetronomo({ x: 0, y: 0 }));
      expect(res.shape).toBe(nextBlock.shape);
    });
    it('you cannot swap a the same 2 blocks twice', () => {
      const IBlock = new BlockBuilder({ x: 5, y: 6 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done('I');
      const OBlock = service.swapBlock(IBlock);
      const res = service.swapBlock(OBlock);
      expect(res).toEqual(OBlock);
    });
  });
});
