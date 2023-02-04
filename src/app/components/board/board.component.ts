import { Component } from '@angular/core';
import {
  Observable,
  interval,
  startWith,
  map,
  BehaviorSubject,
  pairwise,
  pipe,
  take,
  tap,
  distinctUntilChanged,
  distinctUntilKeyChanged,
} from 'rxjs';

type Color = 'white' | 'black' | 'orange';

export interface Square {
  color: Color;
  isPlayer: boolean;
}

export type Row = Square[];
export type Board = Row[];

interface Coordinate {
  x: number;
  y: number;
}
const log = <T>() =>
  pipe<Observable<T>, Observable<T>>(
    tap((x) => console.log(JSON.parse(JSON.stringify(x))))
  );

const clone = <T>() =>
  pipe<Observable<T>, Observable<T>>(map((x) => JSON.parse(JSON.stringify(x))));
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  board = new BehaviorSubject<Board>(this.getInitialBoard());

  private gravity = interval(1000);

  playerPeice = new BehaviorSubject<Coordinate[]>([]);
  // I need to check every second whether a block exists and create it if it does
  // then I need to increase its y coordinate by one every second
  // update the board to reflect its position

  constructor() {
    this.gravity.subscribe(() => {
      const prevValue = this.playerPeice.value;
      const newValue =
        prevValue.length === 0
          ? [
              { x: 4, y: 0 },
              { x: 5, y: 0 },
              { x: 4, y: 1 },
              { x: 5, y: 1 },
            ]
          : prevValue.map((c) => {
              c.y += 1;
              return { ...c };
            });
      this.playerPeice.next(newValue);
    });

    this.playerPeice
      .asObservable()
      .pipe(clone(), pairwise())
      .subscribe(([prev, current]) => {
        const prevValue = this.board.value;
        prev.forEach((c) => {
          prevValue[c.y][c.x].color = 'white';
          prevValue[c.y][c.x].isPlayer = false;
        });
        current.forEach((c) => {
          prevValue[c.y][c.x].color = 'orange';
          prevValue[c.y][c.x].isPlayer = true;
        });
        this.board.next([...prevValue]);
      });
  }

  private getInitialBoard(): Board {
    const board: Board = [];

    for (let i = 0; i < 20; i++) {
      const row: Row = [];
      board.push(row);
      for (let j = 0; j < 10; j++) {
        row.push({ color: 'white', isPlayer: false });
      }
    }
    return board;
  }
}
