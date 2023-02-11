import { Injectable } from '@angular/core';
import { tap, map, pairwise } from 'rxjs';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import { BoardService } from '../board-service/board.service';
import { Block } from '../board-service/models';
import { PlayerPieceService } from '../player-piece/player-piece.service';

@Injectable({
  providedIn: 'root',
})
export class ShadowPieceService {
  constructor(
    private board: BoardService,
    private playerPiece: PlayerPieceService,
    private blockMovement: BlockMovementService
  ) {}

  private getLowestPoint(block: Block): Block {
    const newBlock = this.blockMovement.getFuturePosition('down', block);
    const valid = !this.blockMovement.isInvalidMove(block, newBlock);
    return valid ? this.getLowestPoint(newBlock) : block;
  }

  trackPlayerPiece = this.playerPiece.state$.pipe(
    map((block) => {
      if (!block.length) return block;
      return this.getLowestPoint(block);
    }),
    pairwise(),
    tap(([prev, current]) => {
      this.board.movePiece(prev, current, 'shadow');
    })
  );
}
