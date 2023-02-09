import { Injectable, OnInit } from '@angular/core';
import { tap, map, pairwise } from 'rxjs';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import { Store } from 'src/app/utils/store';
import { BoardService } from '../board-service/board.service';
import { Block } from '../board-service/models';
import { PlayerPieceService } from '../player-piece/player-piece.service';

@Injectable({
  providedIn: 'root',
})
export class ShadowPieceService extends Store<Block> {
  constructor(
    private board: BoardService,
    private playerPiece: PlayerPieceService,
    private blockMovement: BlockMovementService
  ) {
    super([]);
  }

  trackPlayerPiece = this.playerPiece.value$.pipe(
    map((block) => {
      if (!block.length) return block;
      let isValid = true;
      let prevBlock = block;
      while (isValid) {
        const newBlock = this.blockMovement.getFuturePosition(
          'down',
          prevBlock
        );
        const valid = !this.blockMovement.isInvalidMove(
          prevBlock,
          newBlock,
          this.board.value
        );
        if (valid) prevBlock = newBlock;
        else isValid = false;
      }
      return prevBlock;
    }),
    pairwise(),
    tap(([prev, current]) => {
      this.board.clearPiece(prev);
      this.board.setShadowPiece(current);
    })
  );
}
