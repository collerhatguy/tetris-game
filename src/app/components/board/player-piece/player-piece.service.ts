import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import { BoardService } from '../board-service/board.service';
import { Block } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerPieceService {
  private playerPiece = new BehaviorSubject<Block>([]);

  value$ = this.playerPiece.asObservable();

  get value() {
    return this.playerPiece.value;
  }
  constructor(
    private board: BoardService,
    private blockMovement: BlockMovementService
  ) {}

  private createRandomPiece() {
    return [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ];
  }

  moveDown() {
    const createNewBlock = this.value.length === 0;
    const newValue = createNewBlock
      ? this.createRandomPiece()
      : this.blockMovement.getFuturePosition('down', this.value);

    const hitTheGround = this.blockMovement.isInvalidMove(
      this.value,
      newValue,
      this.board.value
    );

    this.playerPiece.next(hitTheGround ? [] : newValue);
  }

  moveLeft() {
    const newValue = this.blockMovement.getFuturePosition('left', this.value);

    const isInvalid = this.blockMovement.isInvalidMove(
      this.value,
      newValue,
      this.board.value
    );

    !isInvalid && this.playerPiece.next(newValue);
  }

  moveRight() {
    const newValue = this.blockMovement.getFuturePosition('right', this.value);

    const isInvalid = this.blockMovement.isInvalidMove(
      this.value,
      newValue,
      this.board.value
    );

    !isInvalid && this.playerPiece.next(newValue);
  }
}
