import { fakeAsync, tick } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { BoardService } from './board-service/board.service';
import { BoardComponent } from './board.component';
import { PlayerInputService } from '../../services/player-input/player-input.service';
import { PlayerPieceService } from './player-piece/player-piece.service';
import { Tetronomo } from './block-generation/model';
import { LevelTrackingService } from './level-tracking/level-tracking.service';
import { RowClearingService } from './row-clearing/row-clearing.service';

describe('BoardComponent', () => {
  let component: BoardComponent;

  beforeEach(async () => {
    const res = await render(BoardComponent, {
      providers: [
        PlayerPieceService,
        BoardService,
        PlayerInputService,
        LevelTrackingService,
        RowClearingService,
      ],
    });
    component = res.fixture.componentInstance;
    component.ngOnDestroy();
  });

  it('should have 20 rows', () => {
    const rows = screen.getAllByTestId('row');
    expect(rows.length).toBe(20);
  });

  it('should have 10 squares for each row', () => {
    const squares = screen.getAllByTestId('square');
    expect(squares.length).toBe(200);
  });

  it('renders the current level', () => {
    const level = screen.getByTestId('level');
    expect(level.textContent).toContain('1');
  });

  it('renders the current score', () => {
    const score = screen.getByTestId('score');
    expect(score.textContent).toContain('0');
  });

  const getPlayerBlock = () => screen.findAllByTestId('player-piece');
  const getShadowBlock = () => screen.findAllByTestId('shadow-block');

  const getBlock = (elements: HTMLElement[]) =>
    new Tetronomo(
      ...elements.map((piece) => {
        const string = piece.getAttribute('coordinate') as string;
        const [x, y] = string.split('-');
        return {
          x: parseInt(x),
          y: parseInt(y),
        };
      })
    );

  const getPlayerCoordinates = async () => {
    const playerPieces = await getPlayerBlock();
    return getBlock(playerPieces);
  };

  const getShadowCoordinates = async () => {
    const shadowBlock = await getShadowBlock();
    return getBlock(shadowBlock);
  };

  const pressA = () => {
    fireEvent.keyDown(window, {
      key: 'a',
      charCode: 65,
      code: 'KeyA',
    } as KeyboardEvent);
  };
  const pressD = () => {
    fireEvent.keyDown(window, {
      key: 'd',
      charCode: 68,
      code: 'KeyD',
    } as KeyboardEvent);
  };
  const pressS = () => {
    fireEvent.keyDown(window, {
      key: 's',
      charCode: 83,
      code: 'KeyS',
    } as KeyboardEvent);
  };

  describe('movement', () => {
    it('after being rendered for a second an orange square will appear at the top of the grid', fakeAsync(async () => {
      component.ngOnInit();
      let playerPieces = screen.queryAllByTestId('player-piece');
      expect(playerPieces.length).toBe(0);
      tick(1001);
      playerPieces = await getPlayerBlock();
      expect(playerPieces.length).toBe(4);
      expect(playerPieces[0].style.backgroundColor).not.toBe('white');
      component.ngOnDestroy();
    }));

    it('the piece will stop falling at the bottom and become solid', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000 * 21);
      const solidPieces = await getPlayerBlock();
      expect(solidPieces.length).toBe(4);
      expect(solidPieces[0].style.backgroundColor).not.toBe('white');
      component.ngOnDestroy();
    }));

    it('the piece will move left if I hit "a"', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000);

      const prevCoordinates = await getPlayerCoordinates();
      pressA();
      const currentCoordinates = await getPlayerCoordinates();

      const expectedCoordinates = Tetronomo.moveLeft(
        new Tetronomo(...prevCoordinates)
      );
      expect(prevCoordinates).not.toEqual(currentCoordinates);
      expect(currentCoordinates).toEqual(expectedCoordinates);

      component.ngOnDestroy();
    }));
    it('the piece will move right if I hit "d"', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000);

      const prevCoordinates = await getPlayerCoordinates();
      pressD();
      const currentCoordinates = await getPlayerCoordinates();

      const expectedCoordinates = Tetronomo.moveRight(
        new Tetronomo(...prevCoordinates)
      );
      expect(prevCoordinates).not.toEqual(currentCoordinates);
      expect(currentCoordinates).toEqual(expectedCoordinates);

      component.ngOnDestroy();
    }));

    it('the piece will not accept further input for a brief time after receiving it', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000);

      let prevCoordinates = await getPlayerCoordinates();
      pressD();
      pressA();
      pressD();
      pressA();
      let currentCoordinates = await getPlayerCoordinates();

      let expectedCoordinates = Tetronomo.moveRight(
        new Tetronomo(...prevCoordinates)
      );
      expect(prevCoordinates).not.toEqual(currentCoordinates);
      expect(currentCoordinates).toEqual(expectedCoordinates);

      tick(300);
      pressA();

      prevCoordinates = currentCoordinates;

      currentCoordinates = await getPlayerCoordinates();

      expectedCoordinates = Tetronomo.moveLeft(
        new Tetronomo(...prevCoordinates)
      );

      expect(prevCoordinates).not.toEqual(currentCoordinates);
      expect(currentCoordinates).toEqual(expectedCoordinates);

      component.ngOnDestroy();
    }));

    it('will go down if I hit "s" button and is not throttled', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000);
      let prevCoordinates = await getPlayerCoordinates();
      pressS();
      let currentCoordinates = await getPlayerCoordinates();

      let expectedCoordinates = Tetronomo.moveDown(
        new Tetronomo(...prevCoordinates)
      );

      expect(currentCoordinates).toEqual(expectedCoordinates);
      pressS();

      prevCoordinates = currentCoordinates;

      currentCoordinates = await getPlayerCoordinates();

      expectedCoordinates = Tetronomo.moveDown(
        new Tetronomo(...prevCoordinates)
      );

      expect(currentCoordinates).toEqual(expectedCoordinates);
      component.ngOnDestroy();
    }));

    it('gravity is reset when the player hits down so as to avoid unexpected input', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000);
      let prevCoordinates = await getPlayerCoordinates();
      tick(900);
      pressS();
      tick(100);
      let currentCoordinates = await getPlayerCoordinates();
      let expectedCoordinates = Tetronomo.moveDown(
        new Tetronomo(...prevCoordinates)
      );

      expect(currentCoordinates).toEqual(expectedCoordinates);
      component.ngOnDestroy();
    }));

    it('has a shadow at the bottom of the screen indicating where the piece will fall', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000);
      let playerCoordinates = await getPlayerCoordinates();
      let shadowBlock = await getShadowCoordinates();
      let playerXCoordinate = playerCoordinates.map((c) => c.x);
      let shadowXCoordinates = shadowBlock.map((c) => c.x);
      expect(playerXCoordinate).toEqual(shadowXCoordinates);
      pressD();
      playerCoordinates = await getPlayerCoordinates();
      shadowBlock = await getShadowCoordinates();
      playerXCoordinate = playerCoordinates.map((c) => c.x);
      shadowXCoordinates = shadowBlock.map((c) => c.x);
      expect(playerXCoordinate).toEqual(shadowXCoordinates);
      component.ngOnDestroy();
    }));
  });
});
