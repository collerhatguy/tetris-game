import { Injectable } from '@angular/core';
import {
  Block,
  Board,
  Coordinate,
} from 'src/app/components/board/board-service/models';

type Direction = 'left' | 'right' | 'down';

@Injectable({
  providedIn: 'root',
})
export class BlockMovementService {
  getFuturePosition(direction: Direction, currentPosition: Block) {
    switch (direction) {
      case 'down':
        return currentPosition.map((c) => ({ ...c, y: c.y + 1 }));
      case 'left':
        return currentPosition.map((c) => ({ ...c, x: c.x - 1 }));
      case 'right':
        return currentPosition.map((c) => ({ ...c, x: c.x + 1 }));
    }
  }

  private getNewlyOccupiedAreas(
    newPosition: Block,
    currentPosition: Block
  ): Block {
    return newPosition.filter(
      (c) => !currentPosition.find((c2) => c2.x === c.x && c.y === c2.y)
    );
  }

  private isInvalidCoordinate(c: Coordinate, board: Board): boolean {
    const hitGround = c.y === board.length;
    if (hitGround) return true;
    const outsideOfBounds = c.x < 0 || c.x > board[0].length - 1;
    if (outsideOfBounds) return true;
    const overlapsWithOtherPiece = board[c.y][c.x].solid;
    return overlapsWithOtherPiece;
  }

  isInvalidMove(prev: Block, current: Block, board: Board) {
    const newlyOccupied = this.getNewlyOccupiedAreas(current, prev);
    return newlyOccupied.some((c) => this.isInvalidCoordinate(c, board));
  }
  constructor() {}
}
