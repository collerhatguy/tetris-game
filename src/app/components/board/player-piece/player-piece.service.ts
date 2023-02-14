import { Injectable, OnInit } from '@angular/core';
import {
  Observable,
  filter,
  switchMap,
  interval,
  startWith,
  map,
  merge,
  tap,
  pairwise,
  mergeMap,
  distinctUntilChanged,
} from 'rxjs';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import {
  Direction,
  RotationalDirection,
} from 'src/app/services/block-movement/models';
import { PlayerInputService } from 'src/app/services/player-input/player-input.service';
import { clone } from 'src/app/utils/operators';
import { Store } from 'src/app/utils/store';
import { BlockGenerationService } from '../block-generation/block-generation.service';
import { BoardService } from '../board-service/board.service';
import { Block } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerPieceService extends Store<Block> {
  constructor(
    private blockMovement: BlockMovementService,
    private playerInput: PlayerInputService,
    private board: BoardService,
    private blockGeneration: BlockGenerationService
  ) {
    super([]);
  }

  private gravity: Observable<'down'> = this.playerInput.input.pipe(
    filter((direction) => direction === 'down'),
    startWith(''),
    switchMap(() => interval(1000).pipe(map(() => 'down' as const)))
  );

  private allInputs = merge(this.playerInput.input, this.gravity).pipe(
    tap((direction) => this.move(direction)),
    map(() => this.state),
    startWith(this.state)
  );

  updateBoardBasedOnPiece = this.allInputs.pipe(
    clone(), // this is something I had to do becuase of how references work in JS
    // if you were to remove it then the prev and current below would be identical every time
    pairwise(),
    tap(([prev, current]) => {
      const hitGround = current.length === 0;
      hitGround
        ? this.board.lockPieceInplace(prev)
        : this.board.movePiece(prev, current);
    })
  );

  private move(direction: Direction) {
    if (direction === 'down') return this.moveDown();
    if (direction === 'rotateRight' || direction === 'rotateLeft')
      return this.rotate(direction);
    this.moveHorizontally(direction);
  }

  private rotate(direction: RotationalDirection) {
    const newValue = this.blockMovement.getFuturePosition(
      direction,
      this.state
    );

    const isInvalid = this.blockMovement.isInvalidMove(this.state, newValue);

    !isInvalid && this.setState(newValue);
  }

  private moveDown() {
    const createNewBlock = this.state.length === 0;
    const newValue = createNewBlock
      ? this.blockGeneration.getNextBlock()
      : this.blockMovement.getFuturePosition('down', this.state);

    const hitTheGround = this.blockMovement.isInvalidMove(this.state, newValue);

    this.setState(hitTheGround ? [] : newValue);
  }

  private moveHorizontally(direction: 'left' | 'right') {
    const newValue = this.blockMovement.getFuturePosition(
      direction,
      this.state
    );

    const isInvalid = this.blockMovement.isInvalidMove(this.state, newValue);

    !isInvalid && this.setState(newValue);
  }
}
