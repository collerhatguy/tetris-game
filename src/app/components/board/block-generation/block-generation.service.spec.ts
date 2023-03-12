import { TestBed } from '@angular/core/testing';
import { BoardService } from '../board-service/board.service';

import { BlockGenerationService } from './block-generation.service';
import { BlockBuilder, Tetronomo } from './model';

describe('BlockGenerationService', () => {
  let service: BlockGenerationService;
  let spy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BoardService, useValue: { boardWidth: 10 } }],
    });
    service = TestBed.inject(BlockGenerationService);

    const allIndexes = [];
    for (let i = 0; i < 7; i++) {
      allIndexes.push(i ? i / 7 : i);
    }

    spy = spyOn(Math, 'random').and.returnValues(...allIndexes, ...allIndexes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generates a random block', () => {
    const block1 = service.getNextBlock();
    const block2 = service.getNextBlock();
    expect(block1).not.toEqual(block2);
  });

  it('will start to return previous blocks once all possible values are emmitted', () => {
    const firstIterationOfBlocks = [];
    for (let i = 0; i < 7; i++) {
      firstIterationOfBlocks.push(service.getNextBlock());
    }

    const secondIterationOfBlocks = [];
    for (let i = 0; i < 7; i++) {
      secondIterationOfBlocks.push(service.getNextBlock());
    }

    expect(firstIterationOfBlocks).toEqual(secondIterationOfBlocks);
  });
  it('will always create the blocks in the "0" position', () => {
    const firstIterationOfBlocks = [];
    for (let i = 0; i < 7; i++) {
      firstIterationOfBlocks.push(service.getNextBlock());
    }
    expect(firstIterationOfBlocks.every((t) => t.position === '0')).toBeTrue();
  });

  describe('caching', () => {
    it('I can cache a piece and have a random block returned to me', () => {
      const tetro = new Tetronomo({ x: 0, y: 0 });
      const newTetro = service.swapBlock(tetro);
      expect(newTetro.shape).toBe('O');
    });
    it('if I call the swap block functon again I will get the original tetro', () => {
      const LBlock = new BlockBuilder({ x: 5, y: 0 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done('I');
      const newTetro = service.swapBlock(LBlock);
      const orignal = service.swapBlock(newTetro);
      expect(orignal).toEqual(LBlock);
    });
    it('if I call the swap block functon the returned block will match the position of the original but not the shape', () => {
      const IBlock = new BlockBuilder({ x: 5, y: 6 })
        .addBlockBelow()
        .addBlockBelow()
        .addBlockBelow()
        .done('I');
      const expected = new BlockBuilder({ x: 5, y: 6 })
        .addBlockRight()
        .addBlockBelow()
        .addBlockLeft()
        .done('O');
      const newTetro = service.swapBlock(IBlock);
      expect(newTetro).toEqual(expected);
    });
  });
});
