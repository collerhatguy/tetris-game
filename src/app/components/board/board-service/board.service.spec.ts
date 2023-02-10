import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { copy } from 'src/app/utils/copy';

import { BoardService } from './board.service';
import { Block, Coordinate } from './models';

describe('BoardService', () => {
  let service: BoardService;
  let sub: Subscription;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardService);
    sub = service.clearsFullRows.subscribe();
  });
  afterEach(() => sub.unsubscribe());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const getLastRow = () => {
    const row = [];

    for (let i = 0; i < service.boardWidth; i++) {
      row.push({
        x: i,
        y: service.boardHeight - 1,
      });
    }
    return row;
  };

  it('should clear rows when they are created', () => {
    const lastRowCordinates = getLastRow();
    const firstSquare = lastRowCordinates.shift() as Coordinate;
    service.lockPieceInplace(lastRowCordinates);
    const [empty, ...solid] = service.state[service.boardHeight - 1];
    expect(empty.solid).toBeFalse();
    expect(solid.every((square) => square.solid)).toBeTrue();
    const firstSquareCordinate: Block = [firstSquare];
    service.lockPieceInplace(firstSquareCordinate);
    const lastRow = service.state[service.boardHeight - 1];
    const isCleared = lastRow.every((square) => !square.solid);
    expect(isCleared).toBeTrue();
  });

  it('should move parent rows down when clearing', () => {
    const lastRowCordinates = getLastRow();
    service.lockPieceInplace([{ x: 0, y: service.boardHeight - 2 }]);
    service.lockPieceInplace(lastRowCordinates);
    const lastRowFirstSquare = service.state[service.boardHeight - 1][0];
    expect(lastRowFirstSquare.solid).toBeTrue();
    const second2lastRowFirstSquare = service.state[service.boardHeight - 2][0];
    expect(second2lastRowFirstSquare.solid).toBeFalse();
  });

  it('should move the top most row if it is filled', () => {
    const lastRowCordinates = getLastRow();
    service.lockPieceInplace([{ x: 0, y: 0 }]);
    service.lockPieceInplace(lastRowCordinates);
    const secondRowFirstSquare = service.state[1][0];
    expect(secondRowFirstSquare.solid).toBeTrue();
    const firstRowFirstSquare = service.state[0][0];
    expect(firstRowFirstSquare.solid).toBeFalse();
  });
});
