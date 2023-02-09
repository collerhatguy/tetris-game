import { Injectable } from '@angular/core';
import { Block, Board } from 'src/app/components/board/board-service/models';

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

  getNewlyOccupiedAreas(newPosition: Block, currentPosition: Block): Block {
    return newPosition.filter(
      (c) => !currentPosition.find((c2) => c2.x === c.x && c.y === c2.y)
    );
  }

  isInvalidMove(prev: Block, current: Block, board: Board) {
    const newlyOccupied = this.getNewlyOccupiedAreas(current, prev);
    return newlyOccupied.some((c) => {
      const hitGround = c.y === board.length;
      if (hitGround) return true;
      const outsideOfBounds = c.x < 0 || c.x > board[0].length - 1;
      if (outsideOfBounds) return true;
      const overlapsWithOtherPiece = board[c.y][c.x].color !== 'white';
      return overlapsWithOtherPiece;
    });
  }
  constructor() {}
}
