import { Injectable } from '@angular/core';
import {
  Block,
  Coordinate,
} from 'src/app/components/board/board-service/models';
import { Direction, RotationalDirection } from './models';

@Injectable({
  providedIn: 'root',
})
export class PredictMovementService {
  getFuturePosition(direction: Direction, currentPosition: Block) {
    switch (direction) {
      case 'down':
        return currentPosition.map((c) => ({ ...c, y: c.y + 1 }));
      case 'left':
        return currentPosition.map((c) => ({ ...c, x: c.x - 1 }));
      case 'right':
        return currentPosition.map((c) => ({ ...c, x: c.x + 1 }));
      case 'rotateRight':
        return this.rotate(currentPosition, direction);
      case 'rotateLeft':
        return this.rotate(currentPosition, direction);
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

  private isHalfFraction(num: number) {
    return num - Math.floor(num) === 0.5;
  }

  private rotate(block: Block, direction: RotationalDirection): Block {
    const { x, y } = this.getBlockAverage(block);

    const isSquare = this.isHalfFraction(x) && this.isHalfFraction(y);

    if (isSquare) return block;

    const axis = {
      x: Math.floor(x),
      y: Math.floor(y),
    };

    return direction === 'rotateRight'
      ? this.rotateRight(axis, block)
      : this.rotateLeft(axis, block);
  }
}
