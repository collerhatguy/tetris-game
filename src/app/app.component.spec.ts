import { AppComponent } from './app.component';
import { fireEvent, render, screen } from '@testing-library/angular';

describe('AppComponent', () => {
  beforeEach(async () => {
    await render(AppComponent, {});
  });

  it('has a start game button that reveals the board', () => {
    const startGame = screen.getByTestId('start-game-btn');
    fireEvent.click(startGame);
    const empty = screen.queryByTestId('start-game-btn');
    expect(empty).toBeFalsy();
    const board = screen.getByTestId('game-board');
  });
});
