import { Injectable } from '@angular/core';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import { Store } from 'src/app/utils/store';
import { Block } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerPieceService extends Store<Block> {
  constructor(private blockMovement: BlockMovementService) {
    super([]);
  }

  private createRandomPiece() {
    return [
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ];
  }

  moveDown() {
    const createNewBlock = this.state.length === 0;
    const newValue = createNewBlock
      ? this.createRandomPiece()
      : this.blockMovement.getFuturePosition('down', this.state);

    const hitTheGround = this.blockMovement.isInvalidMove(this.state, newValue);

    this.setState(hitTheGround ? [] : newValue);
  }

  moveLeft() {
    const newValue = this.blockMovement.getFuturePosition('left', this.state);

    const isInvalid = this.blockMovement.isInvalidMove(this.state, newValue);

    !isInvalid && this.setState(newValue);
  }

  moveRight() {
    const newValue = this.blockMovement.getFuturePosition('right', this.state);

    const isInvalid = this.blockMovement.isInvalidMove(this.state, newValue);

    !isInvalid && this.setState(newValue);
  }
}
