import { Injectable } from '@angular/core';
import { BoardService } from 'src/app/components/board/board-service/board.service';
import {
  Block,
  Coordinate,
} from 'src/app/components/board/board-service/models';

@Injectable({
  providedIn: 'root',
})
export class ValidateMovementService {
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
    const outsideOfBounds =
      c.x < 0 || c.x > this.board.boardWidth - 1 || c.y < 0;
    if (outsideOfBounds) return true;
    const otherPiece = this.board.state[c.y][c.x];
    const overlapsWithOtherPiece = otherPiece.solid && !otherPiece.isPlayer;
    return overlapsWithOtherPiece;
  }

  isInvalidMove(prev: Block, current: Block) {
    const newlyOccupied = this.getNewlyOccupiedAreas(current, prev);
    return newlyOccupied.some((c) => this.isInvalidCoordinate(c));
  }
  constructor(private board: BoardService) {}
}
