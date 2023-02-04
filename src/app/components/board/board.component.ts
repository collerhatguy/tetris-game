import { Component } from '@angular/core';

type Color = 'white' | 'black';
interface Board {
  [yPosition: number]: {
    [xPosition: number]: Color;
  };
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  constructor() {}
}
