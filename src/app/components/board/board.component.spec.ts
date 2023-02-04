import { render, screen } from '@testing-library/angular';

import { BoardComponent } from './board.component';
import { RowComponent } from './row/row.component';

describe('BoardComponent', () => {
  beforeEach(async () => {
    await render(BoardComponent, {
      declarations: [RowComponent],
    });
  });

  it('should have 20 rows', () => {
    const rows = screen.getAllByTestId('row');
    expect(rows.length).toBe(20);
  });
});
