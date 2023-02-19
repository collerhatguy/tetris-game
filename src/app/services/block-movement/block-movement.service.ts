import { Injectable } from '@angular/core';
import {
  Block,
  Coordinate,
} from 'src/app/components/board/board-service/models';
import { Direction, RotationalDirection } from './models';
import { ValidateMovementService } from './validate-movement/validate-movement.service';

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

  private lastPosition: Block = [];

  private lastAxis: Coordinate | undefined;

  // problem: in order to implement wall kicking properly I need to be able to track what rotation the player is in
  // options: I can create a tetronome class that tracks the coordinates and rotation of the block and the type
  // or i can dynamically calculate that from the coordinates.

  private rotate(block: Block, direction: RotationalDirection): Block {
    const { x, y } = this.getBlockAverage(block);

    const isSquare = this.isHalfFraction(x) && this.isHalfFraction(y);

    if (isSquare) return block;

    const alreadyRotated =
      JSON.stringify(block) === JSON.stringify(this.lastPosition);

    const newAxis = block[1];
    const axis = alreadyRotated ? this.lastAxis ?? newAxis : newAxis;

    const newBlock =
      direction === 'rotateRight'
        ? this.rotateRight(axis, block)
        : this.rotateLeft(axis, block);

    const valid = this.validate.isValidMove(block, newBlock);
    if (!valid) {
      const kickedBlock = newBlock.map((c) => ({
        ...c,
        x: c.x + (direction === 'rotateRight' ? -1 : 1),
      }));
      const valid2 = this.validate.isValidMove(block, kickedBlock);
      if (!valid2) {
        return kickedBlock.map((c) => ({
          ...c,
          y: c.y + 1,
        }));
      }
      return kickedBlock;
    }
    this.lastAxis = axis;
    this.lastPosition = [...newBlock];
    return newBlock;
  }

  constructor(private validate: ValidateMovementService) {}
}
