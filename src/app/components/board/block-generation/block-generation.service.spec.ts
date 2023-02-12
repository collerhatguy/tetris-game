import { TestBed } from '@angular/core/testing';
import { BoardService } from '../board-service/board.service';

import { BlockGenerationService } from './block-generation.service';

fdescribe('BlockGenerationService', () => {
  let service: BlockGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService],
    });
    service = TestBed.inject(BlockGenerationService);

    const allIndexes = [];
    for (let i = 0; i < 7; i++) {
      allIndexes.push(i ? i / 7 : i);
    }

    spyOn(Math, 'random').and.returnValues(...allIndexes, ...allIndexes);
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
});
