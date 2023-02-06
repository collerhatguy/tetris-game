import { Injectable } from '@angular/core';
import { Coordinate } from '../board.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PieceService {
  playerPeice = new BehaviorSubject<Coordinate[]>([]);
  constructor() {}

  getLowestPoints(piece: Coordinate[]) {
    return piece.reduce((arr: Coordinate[], c: Coordinate) => {
      if (arr.length === 0) return [c];
      const lowestPoint = arr[0].y;
      if (c.y === lowestPoint) return [...arr, c];
      if (c.y > lowestPoint) return [c];
      return arr;
    }, []);
  }
  moveDown() {}
}
