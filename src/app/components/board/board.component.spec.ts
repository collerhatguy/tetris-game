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
});
