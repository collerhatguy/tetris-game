import { Injectable } from '@angular/core';
import { Tetronomo } from 'src/app/components/board/block-generation/model';
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

  private lastPosition: Block = [];

  private lastAxis: Coordinate | undefined;

  private rotate(block: Tetronomo, direction: RotationalDirection): Tetronomo {
    if (block.shape === 'O') return block;

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
      const kickedBlock =
        direction === 'rotateRight'
          ? Tetronomo.moveLeft(newBlock)
          : Tetronomo.moveRight(newBlock);
      const valid2 = this.validate.isValidMove(block, kickedBlock);
      if (!valid2) {
        return Tetronomo.moveDown(kickedBlock);
      }
      return kickedBlock;
    }
    this.lastAxis = axis;
    this.lastPosition = [...newBlock];
    return newBlock;
  }

  constructor(private validate: ValidateMovementService) {}
}
