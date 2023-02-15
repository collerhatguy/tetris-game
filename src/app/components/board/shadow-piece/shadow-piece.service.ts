import { Injectable } from '@angular/core';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import { Block } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class ShadowPieceService {
  constructor(private blockMovement: BlockMovementService) {}

  calculateShadowBlock(block: Block): Block {
    if (block.length === 0) return block;
    const newBlock = this.blockMovement.getFuturePosition('down', block);
    const valid = !this.blockMovement.isInvalidMove(block, newBlock);
    return valid ? this.calculateShadowBlock(newBlock) : block;
  }
}
