import { Injectable } from '@angular/core';
import { BoardService } from 'src/app/components/board/board-service/board.service';
import {
  Block,
  Coordinate,
} from 'src/app/components/board/board-service/models';
import { Direction, RotationalDirection } from './models';
import { PredictMovementService } from './predict-movement.service';
import { ValidateMovementService } from './validate-movement.service';

@Injectable({
  providedIn: 'root',
})
export class BlockMovementService {
  getFuturePosition(direction: Direction, currentPosition: Block) {
    return this.predict.getFuturePosition(direction, currentPosition);
  }

  isInvalidMove(prev: Block, current: Block) {
    return this.validate.isInvalidMove(prev, current);
  }
  constructor(
    private validate: ValidateMovementService,
    private predict: PredictMovementService
  ) {}
}
