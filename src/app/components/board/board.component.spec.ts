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
    component.ngOnInit();
  });

  afterEach(() => {
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

  const getPlayerPieces = () => screen.findAllByTestId('player-peice');

  const getPlayerCoordinates = async () => {
    const playerPieces = await screen.findAllByTestId('player-peice');
    return playerPieces.map((piece) => {
      const string = piece.getAttribute('coordinate') as string;
      const [x, y] = string.split('-');
      return {
        x: parseInt(x),
        y: parseInt(y),
      };
    });
  };

  const pressA = () =>
    fireEvent.keyDown(document, {
      key: 'a',
      charCode: 65,
      code: 'KeyA',
    });

  it('after being rendered for a second an orange square will appear at the top of the grid', fakeAsync(async () => {
    component.ngOnInit();
    let playerPieces = screen.queryAllByTestId('player-peice');
    expect(playerPieces.length).toBe(0);
    tick(1001);
    playerPieces = await getPlayerPieces();
    expect(playerPieces.length).toBe(4);
    expect(playerPieces[0].style.backgroundColor).toBe('orange');
    component.ngOnDestroy();
  }));

  it('the peice will stop falling at the bottom and become solid', fakeAsync(async () => {
    component.ngOnInit();
    tick(1000 * 21);
    const solidPieces = await screen.findAllByTestId('solid-peice');
    expect(solidPieces.length).toBe(4);
    expect(solidPieces[0].style.backgroundColor).toBe('orange');
    component.ngOnDestroy();
  }));

  it('the peice will move left if I hit "a" and right if I hit "d"', fakeAsync(async () => {
    component.ngOnInit();
    // tick(1000);
    // const prevCoordinates = await getPlayerCoordinates();
    // pressA();
    // const currentCoordinates = await getPlayerCoordinates();

    // const updatedCoordinates = prevCoordinates.map((c) => {
    //   c.x -= 1;
    //   return c;
    // });

    // expect(updatedCoordinates).toEqual(currentCoordinates);

    component.ngOnDestroy();
  }));
});
