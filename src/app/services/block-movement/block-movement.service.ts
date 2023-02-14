import { Injectable } from '@angular/core';
import { BoardService } from 'src/app/components/board/board-service/board.service';
import {
  Block,
  Coordinate,
} from 'src/app/components/board/board-service/models';
import { Direction } from './models';

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
      case 'rotateRight':
        return this.rotate(currentPosition, 'right');
      case 'rotateLeft':
        return this.rotate(currentPosition, 'left');
    }
  }

  private getBlockAverage(block: Block) {
    const sum = block.reduce(
      (sum, square) => {
        sum.xSum += square.x;
        sum.ySum += square.y;
        return sum;
      },
      {
        xSum: 0,
        ySum: 0,
      }
    );

    return {
      x: sum.xSum / block.length,
      y: sum.ySum / block.length,
    };
  }

  private rotateRight(axis: Coordinate, block: Block) {
    return block.map((c) => ({
      x: axis.x - (c.y - axis.y),
      y: c.x - axis.x + axis.y,
    }));
  }
  private rotateLeft(axis: Coordinate, block: Block) {
    return block.map((c) => ({
      x: axis.x + (c.y - axis.y),
      y: axis.y - (c.x - axis.x),
    }));
  }

  private rotate(block: Block, direction: 'left' | 'right'): Block {
    const { x, y } = this.getBlockAverage(block);

    const isSquare =
      (x + 1) % Math.floor(x + 1) === 0.5 &&
      (y + 1) % Math.floor(y + 1) === 0.5;

    if (isSquare) return block;

    const axis = {
      x: Math.floor(x),
      y: Math.floor(y),
    };

    return direction === 'right'
      ? this.rotateRight(axis, block)
      : this.rotateLeft(axis, block);
  }

  private getNewlyOccupiedAreas(
    newPosition: Block,
    currentPosition: Block
  ): Block {
    return newPosition.filter(
      (c) => !currentPosition.find((c2) => c2.x === c.x && c.y === c2.y)
    );
  }

  private isInvalidCoordinate(c: Coordinate): boolean {
    const hitGround = c.y >= this.board.boardHeight;
    if (hitGround) return true;
    const outsideOfBounds = c.x < 0 || c.x > this.board.boardWidth - 1;
    if (outsideOfBounds) return true;
    const overlapsWithOtherPiece = this.board.state[c.y][c.x].solid;
    return overlapsWithOtherPiece;
  }

  isInvalidMove(prev: Block, current: Block) {
    const newlyOccupied = this.getNewlyOccupiedAreas(current, prev);
    return newlyOccupied.some((c) => this.isInvalidCoordinate(c));
  }
  constructor(private board: BoardService) {}
}
