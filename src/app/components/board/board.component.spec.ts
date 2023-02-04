import { fakeAsync, tick, flushMicrotasks, flush } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  beforeEach(async () => {
    await render(BoardComponent, {});
  });

  it('should have 20 rows', () => {
    const rows = screen.getAllByTestId('row');
    expect(rows.length).toBe(20);
  });

  it('should have 10 squares for each row', () => {
    const squares = screen.getAllByTestId('square');
    expect(squares.length).toBe(200);
  });

  // it('after being rendered for a second an orange square will appear at the top of the grid', fakeAsync(async () => {
  //   let playerPieces = screen.queryAllByTestId('player-peice');
  //   expect(playerPieces.length).toBe(0);
  //   tick(1000);
  //   flush();
  //   flushMicrotasks();
  //   playerPieces = screen.getAllByTestId('player-peice');
  //   expect(playerPieces.length).toBe(4);
  //   expect(playerPieces[0].style.color).toBe('orange');
  // }));
});
