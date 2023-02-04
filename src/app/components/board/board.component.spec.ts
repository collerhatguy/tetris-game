import { render } from '@testing-library/angular';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  beforeEach(async () => {
    await render(BoardComponent);
  });

  it('should create', () => {});
});
