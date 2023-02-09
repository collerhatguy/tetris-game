import { fakeAsync, tick } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { BoardService } from './board-service/board.service';
import { BoardComponent } from './board.component';
import { PlayerInputService } from './player-input/player-input.service';
import { PlayerPieceService } from './player-piece/player-piece.service';

describe('BoardComponent', () => {
  let component: BoardComponent;

  beforeEach(async () => {
    const res = await render(BoardComponent, {
      providers: [PlayerPieceService, BoardService, PlayerInputService],
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

  const getPlayerPieces = () => screen.findAllByTestId('player-piece');

  const getPlayerCoordinates = async () => {
    const playerPieces = await getPlayerPieces();
    return playerPieces.map((piece) => {
      const string = piece.getAttribute('coordinate') as string;
      const [x, y] = string.split('-');
      return {
        x: parseInt(x),
        y: parseInt(y),
      };
    });
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
      playerPieces = await getPlayerPieces();
      expect(playerPieces.length).toBe(4);
      expect(playerPieces[0].style.backgroundColor).toBe('orange');
      component.ngOnDestroy();
    }));

    it('the piece will stop falling at the bottom and become solid', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000 * 21);
      const solidPieces = await getPlayerPieces();
      expect(solidPieces.length).toBe(4);
      expect(solidPieces[0].style.backgroundColor).toBe('orange');
      component.ngOnDestroy();
    }));

    it('the piece will move left if I hit "a"', fakeAsync(async () => {
      component.ngOnInit();
      tick(1000);

      const prevCoordinates = await getPlayerCoordinates();
      pressA();
      const currentCoordinates = await getPlayerCoordinates();

      const expectedCoordinates = prevCoordinates.map((c) => ({
        ...c,
        x: c.x - 1,
      }));
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

      const expectedCoordinates = prevCoordinates.map((c) => ({
        ...c,
        x: c.x + 1,
      }));
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

      let expectedCoordinates = prevCoordinates.map((c) => ({
        ...c,
        x: c.x + 1,
      }));
      expect(prevCoordinates).not.toEqual(currentCoordinates);
      expect(currentCoordinates).toEqual(expectedCoordinates);

      tick(300);
      pressA();

      prevCoordinates = currentCoordinates;

      currentCoordinates = await getPlayerCoordinates();

      expectedCoordinates = prevCoordinates.map((c) => ({
        ...c,
        x: c.x - 1,
      }));

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

      let expectedCoordinates = prevCoordinates.map((c) => ({
        ...c,
        y: c.y + 1,
      }));

      expect(currentCoordinates).toEqual(expectedCoordinates);
      pressS();

      prevCoordinates = currentCoordinates;

      currentCoordinates = await getPlayerCoordinates();

      expectedCoordinates = prevCoordinates.map((c) => ({
        ...c,
        y: c.y + 1,
      }));

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
      let expectedCoordinates = prevCoordinates.map((c) => ({
        ...c,
        y: c.y + 1,
      }));

      expect(currentCoordinates).toEqual(expectedCoordinates);
      component.ngOnDestroy();
    }));
  });
});
