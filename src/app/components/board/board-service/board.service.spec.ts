import { TestBed } from '@angular/core/testing';
import { copy } from 'src/app/utils/copy';

import { BoardService } from './board.service';
import { Block } from './models';

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear rows when they are created', () => {
    const sub = service.clearsFullRows.subscribe();
    const bottomRowButNotFirstSquare: Block = [];
    for (let i = 1; i < service.boardWidth; i++) {
      bottomRowButNotFirstSquare.push({
        x: i,
        y: service.boardHeight - 1,
      });
    }
    service.lockPieceInplace(bottomRowButNotFirstSquare);
    const [empty, ...solid] = service.state[service.boardHeight - 1];
    expect(empty.solid).toBeFalse();
    expect(solid.every((square) => square.solid)).toBeTrue();
    const firstSquare: Block = [
      {
        x: 0,
        y: service.boardHeight - 1,
      },
    ];
    service.lockPieceInplace(firstSquare);
    const lastRow = service.state[service.boardHeight - 1];
    const isCleared = lastRow.every((square) => !square.solid);
    expect(isCleared).toBeTrue();
    sub.unsubscribe();
  });
});
