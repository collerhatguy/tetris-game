import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { BlockBuilder, Tetronomo } from '../block-generation/model';
import { RowClearingService } from '../row-clearing/row-clearing.service';

import { BoardService } from './board.service';
import { Block, Coordinate, Square } from './models';

describe('BoardService', () => {
  let service: BoardService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RowClearingService],
    });
    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const getLastRow = () => {
    return getNthToLastRow(0);
  };

  const getNthToLastRow = (n: number = 0) => {
    const row = [];

    for (let i = 0; i < service.boardWidth; i++) {
      row.push({
        x: i,
        y: service.boardHeight - 1 - n,
      });
    }

    return new Tetronomo(...row);
  };

  it('should clear rows when they are created', () => {
    const lastRowCordinates = getLastRow();
    const firstSquare = lastRowCordinates.shift() as Coordinate;
    service.lockPieceInplace(lastRowCordinates);
    const [empty, ...solid] = service.state[service.boardHeight - 1];
    expect(empty.solid).toBeFalse();
    expect(solid.every((square) => square.solid)).toBeTrue();
    const firstSquareCordinate = new Tetronomo(firstSquare);
    service.lockPieceInplace(firstSquareCordinate);
    const lastRow = service.state[service.boardHeight - 1];
    const isCleared = lastRow.every((square) => !square.solid);
    expect(isCleared).toBeTrue();
  });

  it('should move parent rows down when clearing', () => {
    const lastRowCordinates = getLastRow();
    const lockPiece = new Tetronomo({ x: 0, y: service.boardHeight - 2 });
    service.lockPieceInplace(lockPiece);
    service.lockPieceInplace(lastRowCordinates);
    const lastRowFirstSquare = service.state[service.boardHeight - 1][0];
    expect(lastRowFirstSquare.solid).toBeTrue();
    const second2lastRowFirstSquare = service.state[service.boardHeight - 2][0];
    expect(second2lastRowFirstSquare.solid).toBeFalse();
  });

  it('should move the top most row if it is filled', () => {
    const lastRowCordinates = getLastRow();
    const lockPiece = new Tetronomo({ x: 0, y: 0 });
    service.lockPieceInplace(lockPiece);
    service.lockPieceInplace(lastRowCordinates);
    const secondRowFirstSquare = service.state[1][0];
    expect(secondRowFirstSquare.solid).toBeTrue();
    const firstRowFirstSquare = service.state[0][0];
    expect(firstRowFirstSquare.solid).toBeFalse();
  });

  it('should be able to clear multiple rows and move the pieces down proeprly', () => {
    const last2Rows = new Tetronomo(...getLastRow(), ...getNthToLastRow(1));
    const block = new Tetronomo(
      getNthToLastRow(2).shift()!,
      getNthToLastRow(3).shift()!
    );

    service.lockPieceInplace(block);
    service.lockPieceInplace(last2Rows);

    const lastRowFirstSquare = service.state[service.boardHeight - 1][0];
    const second2LastRowFirstSquare = service.state[service.boardHeight - 2][0];
    expect(lastRowFirstSquare.solid).toBeTrue();
    expect(second2LastRowFirstSquare.solid).toBeTrue();
  });

  const isShadow = (sqr: Square) => {
    expect(sqr.solid).toBeFalse();
    expect(sqr.isPlayer).toBeFalse();
    expect(sqr.color === 'white').toBeFalse();
  };
  const isPlayer = (sqr: Square) => {
    expect(sqr.solid).toBeTrue();
    expect(sqr.isPlayer).toBeTrue();
    expect(sqr.color === 'white').toBeFalse();
  };
  const isEmpty = (sqr: Square) => {
    expect(sqr.solid).toBeFalse();
    expect(sqr.isPlayer).toBeFalse();
    expect(sqr.color === 'white').toBeTrue();
  };

  describe('shadow block', () => {
    it('should have a shadow block tracking the player', () => {
      const player = new BlockBuilder({ x: 0, y: 0 }).done();
      service.movePiece(new Tetronomo(), player);
      const board = service.state;
      const shadow = board.at(-1)?.at(0) as Square;
      isShadow(shadow);

      const nextPosition = new BlockBuilder({ x: 1, y: 0 }).done();
      service.movePiece(player, nextPosition);
      const newBoard = service.state;
      const nextShadow = newBoard.at(-1)?.at(1) as Square;
      const prevShadow = newBoard.at(-1)?.at(0) as Square;
      isEmpty(prevShadow);
      isShadow(nextShadow);
    });

    it('the shadow block should not override the player block', () => {
      const player = new BlockBuilder({ x: 0, y: service.boardHeight - 2 })
        .addBlockAbove()
        .done();
      service.movePiece(new Tetronomo(), player);
      const board = service.state;
      const shadow = board.at(-1)?.at(0) as Square;
      const player2 = board.at(-2)?.at(0) as Square;
      isShadow(shadow);
      isPlayer(player2);
    });
  });
  it('has 4 extra rows that are not available publically', () => {
    const spy = subscribeSpyTo(service.shownBoard);
    expect(service.state.length).toBe(service.boardHeight);
    expect(spy.getFirstValue().length).toBe(
      service.boardHeight - service.hiddenRows
    );
  });
});
