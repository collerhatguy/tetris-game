import { Injectable } from '@angular/core';
import { Tetronomo } from 'src/app/components/board/block-generation/model';
import {
  Block,
  Coordinate,
} from 'src/app/components/board/board-service/models';
import { Direction, RotationalDirection } from './models';

@Injectable({
  providedIn: 'root',
})
export class BlockMovementService {
  getFuturePosition(
    direction: Direction,
    currentPosition: Tetronomo
  ): Tetronomo {
    switch (direction) {
      case 'down':
        return Tetronomo.moveDown(currentPosition);
      case 'left':
        return Tetronomo.moveLeft(currentPosition);
      case 'right':
        return Tetronomo.moveRight(currentPosition);
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

  private rotateRight(axis: Coordinate, block: Tetronomo) {
    const rotated = block.map((c) => ({
      x: axis.x - (c.y - axis.y),
      y: c.x - axis.x + axis.y,
    }));
    const tetro = new Tetronomo(...rotated);
    tetro.rotateRight(block.position);
    tetro.shape = block.shape;
    return tetro;
  }
  private rotateLeft(axis: Coordinate, block: Tetronomo) {
    const rotated = block.map((c) => ({
      x: axis.x + (c.y - axis.y),
      y: axis.y - (c.x - axis.x),
    }));
    const tetro = new Tetronomo(...rotated);
    tetro.rotateLeft(block.position);
    tetro.shape = block.shape;
    return tetro;
  }

  private isHalfFraction(num: number) {
    return num - Math.floor(num) === 0.5;
  }

  private lastPosition: Block = [];

  private lastAxis: Coordinate | undefined;

  private rotate(block: Tetronomo, direction: RotationalDirection): Tetronomo {
    const { x, y } = this.getBlockAverage(block);

    const isSquare = this.isHalfFraction(x) && this.isHalfFraction(y);

    if (isSquare) return block;

    const alreadyRotated =
      JSON.stringify(block) === JSON.stringify(this.lastPosition);

    const newAxis = {
      x: Math.floor(x),
      y: Math.floor(y),
    };
    const axis = alreadyRotated ? this.lastAxis ?? newAxis : newAxis;

    const newBlock =
      direction === 'rotateRight'
        ? this.rotateRight(axis, block)
        : this.rotateLeft(axis, block);

    this.lastAxis = axis;
    this.lastPosition = [...newBlock];
    return newBlock;
  }
}
