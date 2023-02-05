import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Observable,
  interval,
  map,
  BehaviorSubject,
  pipe,
  tap,
  Subject,
  pairwise,
  takeWhile,
  takeUntil,
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
export class BoardComponent implements OnDestroy, OnInit {
  private readonly boardHeight = 20;
  private readonly boardWidth = 10;

  board = new BehaviorSubject<Board>(this.getInitialBoard());

  private destroy = new Subject();

  playerPeice = new BehaviorSubject<Coordinate[]>([]);

  gravity = interval(1000).pipe(
    takeUntil(this.destroy),
    tap(() => {
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

      const currentBoard = this.board.value;
      const lowestPoints = newValue.reduce(
        (arr: Coordinate[], c: Coordinate) => {
          if (arr.length === 0) return [c];
          const lowestPoint = arr[0].y;
          if (c.y === lowestPoint) return [...arr, c];
          if (c.y > lowestPoint) return [c];
          return arr;
        },
        []
      );
      const hitTheGround = lowestPoints.some(
        (c) =>
          c.y === this.boardHeight || currentBoard[c.y][c.x].color !== 'white'
      );
      this.playerPeice.next(hitTheGround ? [] : newValue);
    })
  );

  // I need to check every second whether a block exists and create it if it does
  // then I need to increase its y coordinate by one every second
  // update the board to reflect its position

  constructor() {}
  ngOnInit(): void {
    this.gravity.subscribe();
    this.playerPeice
      .asObservable()
      .pipe(clone(), pairwise(), takeUntil(this.destroy))
      .subscribe(([prev, current]) => {
        const prevValue = this.board.value;
        if (current.length !== 0)
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
    for (let i = 0; i < this.boardHeight; i++) {
      const row: Row = [];
      board.push(row);
      for (let j = 0; j < this.boardWidth; j++) {
        row.push({ color: 'white', isPlayer: false });
      }
    }
    return board;
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }
}
