import { Injectable, Injector } from '@angular/core';
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

  private isValidCoordinate(c: Coordinate): boolean {
    const board = this.injector.get(BoardService);
    const hitGround = c.y >= board.boardHeight;
    if (hitGround) return false;
    const outsideOfBounds = c.x < 0 || c.x > board.boardWidth - 1 || c.y < 0;
    if (outsideOfBounds) return false;
    const block = board.state[c.y][c.x];
    const overlapsWithOtherPiece = block.solid && !block.isPlayer;
    return !overlapsWithOtherPiece;
  }

  isValidMove(current: Block) {
    // const newlyOccupied = this.getNewlyOccupiedAreas(current, prev);
    return current.every((c) => this.isValidCoordinate(c));
  }
  constructor(private injector: Injector) {}
}
