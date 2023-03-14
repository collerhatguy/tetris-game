import { Injectable } from '@angular/core';
import {
  Position,
  Tetronomo,
} from 'src/app/components/board/block-generation/model';
import {
  Block,
  Coordinate,
} from 'src/app/components/board/board-service/models';
import { Direction, RotationalDirection, wallKickData } from './models';
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
    tetro.rotate('rotateRight', block.position);
    tetro.shape = block.shape;
    return tetro;
  }
  private rotateLeft(axis: Coordinate, block: Tetronomo) {
    const rotated = block.map((c) => ({
      x: axis.x + (c.y - axis.y),
      y: axis.y - (c.x - axis.x),
    }));
    const tetro = new Tetronomo(...rotated);
    tetro.rotate('rotateLeft', block.position);
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

    const kickedBlock = this.wallKick(newBlock, direction, block.position);
    this.lastAxis = axis;
    this.lastPosition = [...kickedBlock];
    return kickedBlock;
  }

  private wallKick(
    block: Tetronomo,
    direction: RotationalDirection,
    prevPosition: Position
  ): Tetronomo {
    const valid = this.validate.isValidMove(new Tetronomo(), block);
    if (valid) return block;
    const alternativePositions = wallKickData[prevPosition][direction];
    for (let c of alternativePositions) {
      const copy = new Tetronomo(...[...block]);
      const kickCordinates = copy.map((coordinate) => ({
        x: coordinate.x + c.x,
        y: coordinate.y + c.y,
      }));
      const valid = this.validate.isValidMove(new Tetronomo(), kickCordinates);
      if (valid) {
        const tetro = new Tetronomo(...kickCordinates);
        tetro.rotate(direction, prevPosition);
        tetro.shape = block.shape;
        return tetro;
      }
    }
    return block;
  }

  replaceTetronome(toReplace: Tetronomo, replacer: Tetronomo) {
    const firstBlock = toReplace.at(0)!;
    const newFirstBlock = replacer.at(0)!;
    const spacesToMoveDown = firstBlock.y - newFirstBlock.y;
    const spacesToMoveHorizontally = firstBlock.x - newFirstBlock.x;
    const yAdjustedTetro = Tetronomo.moveDown(replacer, spacesToMoveDown);
    const xAdjustedTetro = Tetronomo.moveRight(
      yAdjustedTetro,
      spacesToMoveHorizontally
    );

    return xAdjustedTetro;
  }

  getLowestPoint(block: Tetronomo): Tetronomo {
    if (block.length === 0) return block;
    const newBlock = this.getFuturePosition('down', block);
    const valid = this.validate.isValidMove(block, newBlock);
    return valid ? this.getLowestPoint(newBlock) : block;
  }

  constructor(private validate: ValidateMovementService) {}
}
