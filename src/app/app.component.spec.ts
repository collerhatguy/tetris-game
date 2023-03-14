import { AppComponent } from './app.component';
import { fireEvent, render, screen } from '@testing-library/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await render(AppComponent, {
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  });

  it('has a start game button that reveals the game', () => {
    const startGame = screen.getByTestId('start-game-btn');
    fireEvent.click(startGame);
    const empty = screen.queryByTestId('start-game-btn');
    expect(empty).toBeFalsy();
    const game = screen.getByTestId('game');
  });
  it('I can hit the instructions btn and be taken to the instruction', () => {
    const instructions = screen.getByTestId('instructions-btn');
    fireEvent.click(instructions);
    const empty = screen.queryByTestId('instructions-btn');
    expect(empty).toBeFalsy();
    screen.getByTestId('instructions');
  });
  it('I can click back from the instructions page', () => {
    const instructions = screen.getByTestId('instructions-btn');
    fireEvent.click(instructions);
    const back = screen.getByTestId('back-btn');
    fireEvent.click(back);
    screen.getByTestId('starter-menu');
  });
});
