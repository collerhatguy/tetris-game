import { Injectable } from '@angular/core';
import { startWith, map, merge, tap, pairwise } from 'rxjs';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import {
  Command,
  HorizontalDirection,
  RotationalDirection,
} from 'src/app/services/block-movement/models';
import { ValidateMovementService } from 'src/app/services/block-movement/validate-movement/validate-movement.service';
import { PlayerInputService } from 'src/app/services/player-input/player-input.service';
import { Store } from 'src/app/utils/store';
import { BlockGenerationService } from '../block-generation/block-generation.service';
import { Tetronomo } from '../block-generation/model';
import { BoardService } from '../board-service/board.service';
import { GravityService } from '../gravity/gravity.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerPieceService extends Store<Tetronomo> {
  constructor(
    private blockMovement: BlockMovementService,
    private validate: ValidateMovementService,
    private playerInput: PlayerInputService,
    private board: BoardService,
    private blockGeneration: BlockGenerationService,
    private gravity: GravityService
  ) {
    super(new Tetronomo());
  }

  private allInputs = merge(this.playerInput.input, this.gravity.gravity).pipe(
    tap((direction) => this.move(direction)),
    map(() => this.state),
    startWith(this.state)
  );

  updateBoardBasedOnPiece = this.allInputs.pipe(
    pairwise(),
    tap(([prev, current]) => {
      const hitGround = current.length === 0;
      hitGround
        ? this.board.lockPieceInplace(prev)
        : this.board.movePiece(prev, current);
    })
  );

  private move(direction: Command) {
    if (direction === 'down') return this.moveDown();
    if (direction === 'rotateRight' || direction === 'rotateLeft')
      return this.rotate(direction);
    if (direction === 'swap') return this.swap();
    if (direction === 'drop') return this.drop();

    this.moveHorizontally(direction);
  }

  private drop() {
    const newValue = this.blockMovement.getLowestPoint(this.state);
    this.setState(newValue);
  }

  private swap() {
    if (!this.state.length) return;
    const newValue = this.blockGeneration.swapBlock(this.state);
    const valid = this.validate.isValidMove(newValue);

    valid ? this.setState(newValue) : this.blockGeneration.swapBlock(newValue);
  }

  private rotate(direction: RotationalDirection) {
    const newValue = this.blockMovement.getFuturePosition(
      direction,
      this.state
    );

    const valid = this.validate.isValidMove(newValue);

    valid && this.setState(newValue);
  }

  private moveDown() {
    const createNewBlock = this.state.length === 0;
    const newValue = createNewBlock
      ? this.blockGeneration.getNextBlock()
      : this.blockMovement.getFuturePosition('down', this.state);

    const hitTheGround = !this.validate.isValidMove(newValue);

    this.setState(hitTheGround ? new Tetronomo() : newValue);
  }

  private moveHorizontally(direction: HorizontalDirection) {
    const newValue = this.blockMovement.getFuturePosition(
      direction,
      this.state
    );

    const valid = this.validate.isValidMove(newValue);

    valid && this.setState(newValue);
  }
}
