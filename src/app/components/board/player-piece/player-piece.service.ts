import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardService } from '../board-service/board.service';
import { Coordinate } from '../board-service/models';

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

  private getNewlyOccupiedAreas(
    newPosition: Coordinate[],
    currentPosition = this.value
  ): Coordinate[] {
    return newPosition.filter(
      (c) => !currentPosition.find((c2) => c2.x === c.x && c.y === c2.y)
    );
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
        : this.value.map((c) => ({ ...c, y: c.y + 1 }));
    const newlyOccupied = this.getNewlyOccupiedAreas(newValue);
    const currentBoard = this.board.value;
    const hitTheGround = newlyOccupied.some(
      (c) =>
        c.y === currentBoard.length || currentBoard[c.y][c.x].color !== 'white'
    );
    this.playerPiece.next(hitTheGround ? [] : newValue);
  }

  moveLeft() {
    const newValue = this.value.map((c) => ({
      ...c,
      x: c.x - 1,
    }));

    const newlyOccupied = this.getNewlyOccupiedAreas(newValue);
    const currentBoard = this.board.value;
    const isInvalid = newlyOccupied.some(
      (c) => c.x < 0 || currentBoard[c.y][c.x].color !== 'white'
    );

    !isInvalid && this.playerPiece.next(newValue);
  }
}
