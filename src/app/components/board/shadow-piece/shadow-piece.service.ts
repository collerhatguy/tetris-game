import { Injectable } from '@angular/core';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import { ValidateMovementService } from 'src/app/services/block-movement/validate-movement/validate-movement.service';
import { Block } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class ShadowPieceService {
  constructor(
    private validate: ValidateMovementService,
    private movement: BlockMovementService
  ) {}

  calculateShadowBlock(block: Block): Block {
    if (block.length === 0) return block;
    const newBlock = this.movement.getFuturePosition('down', block);
    const valid = this.validate.isValidMove(block, newBlock);
    return valid ? this.calculateShadowBlock(newBlock) : block;
  }
}
