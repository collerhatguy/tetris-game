import { Component } from '@angular/core';

export type Color = 'white' | 'black';
export type Row = Color[];
type Board = Row[];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  board: Board = this.getInitialBoard();

  constructor() {}

  private getInitialBoard(): Board {
    const board: Board = [];

    for (let i = 0; i < 20; i++) {
      const row: Color[] = [];
      board.push(row);
      for (let j = 0; j < 10; j++) {
        row.push('white');
      }
    }
    return board;
  }
}
