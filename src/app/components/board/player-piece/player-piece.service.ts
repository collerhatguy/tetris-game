import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardService } from '../board-service/board.service';
import { Coordinate } from '../board.component';

@Injectable({
  providedIn: 'root',
})
export class PlayerPieceService {
  private playerPiece = new BehaviorSubject<Coordinate[]>([]);

  value$ = this.playerPiece.asObservable();

  get value() {
    return this.playerPiece.value;
  }
  constructor(private board: BoardService) {}

  private getLowestPoints(piece: Coordinate[]) {
    return piece.reduce((arr: Coordinate[], c: Coordinate) => {
      if (arr.length === 0) return [c];
      const lowestPoint = arr[0].y;
      if (c.y === lowestPoint) return [...arr, c];
      if (c.y > lowestPoint) return [c];
      return arr;
    }, []);
  }

  moveDown() {
    const newValue =
      this.value.length === 0
        ? [
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 4, y: 1 },
            { x: 5, y: 1 },
          ]
        : this.value.map((c) => {
            c.y += 1;
            return { ...c };
          });
    const lowestPoints = this.getLowestPoints(newValue);
    const currentBoard = this.board.value;
    const hitTheGround = lowestPoints.some(
      (c) =>
        c.y === currentBoard.length || currentBoard[c.y][c.x].color !== 'white'
    );
    this.playerPiece.next(hitTheGround ? [] : newValue);
  }
}
