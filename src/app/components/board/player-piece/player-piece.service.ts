import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardService } from '../board-service/board.service';
import { Coordinate } from '../board-service/models';

type Direction = 'left' | 'right' | 'down';

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

  private createRandomPiece() {
    return [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ];
  }

  private getFuturePosition(direction: Direction) {
    switch (direction) {
      case 'down':
        return this.value.map((c) => ({ ...c, y: c.y + 1 }));
      case 'left':
        return this.value.map((c) => ({ ...c, x: c.x - 1 }));
      case 'right':
        return this.value.map((c) => ({ ...c, x: c.x + 1 }));
    }
  }

  private isInvalidPosition(piece: Coordinate[]) {
    const newlyOccupied = this.getNewlyOccupiedAreas(piece);
    const currentBoard = this.board.value;
    return newlyOccupied.some((c) => {
      const hitGround = c.y === currentBoard.length;
      if (hitGround) return true;
      const overlapsWithOtherPiece = currentBoard[c.y][c.x].color !== 'white';
      if (overlapsWithOtherPiece) return true;
      const outsideOfBounds = c.x < 0 || c.x > currentBoard[0].length - 1;
      return outsideOfBounds;
    });
  }

  moveDown() {
    const createNewBlock = this.value.length === 0;
    const newValue = createNewBlock
      ? this.createRandomPiece()
      : this.getFuturePosition('down');

    const hitTheGround = this.isInvalidPosition(newValue);

    this.playerPiece.next(hitTheGround ? [] : newValue);
  }

  moveLeft() {
    const newValue = this.getFuturePosition('left');

    const isInvalid = this.isInvalidPosition(newValue);

    !isInvalid && this.playerPiece.next(newValue);
  }

  moveRight() {
    const newValue = this.getFuturePosition('right');

    const isInvalid = this.isInvalidPosition(newValue);

    !isInvalid && this.playerPiece.next(newValue);
  }
}
