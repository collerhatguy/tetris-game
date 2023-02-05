import { fakeAsync, tick, flushMicrotasks, flush } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;

  beforeEach(async () => {
    const res = await render(BoardComponent, {});
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

  it('after being rendered for a second an orange square will appear at the top of the grid', fakeAsync(async () => {
    component.ngOnInit();
    let playerPieces = screen.queryAllByTestId('player-peice');
    expect(playerPieces.length).toBe(0);
    tick(1001);
    playerPieces = await screen.findAllByTestId('player-peice');
    expect(playerPieces.length).toBe(4);
    expect(playerPieces[0].style.backgroundColor).toBe('orange');
    component.ngOnDestroy();
  }));
});
