import { Injectable, OnInit } from '@angular/core';
import { filter, pairwise } from 'rxjs';
import { Store } from 'src/app/utils/store';
import { BoardService } from '../board-service/board.service';
import { Block } from '../board-service/models';
import { PlayerPieceService } from '../player-piece/player-piece.service';

@Injectable({
  providedIn: 'root',
})
export class ShadowPieceService extends Store<Block> implements OnInit {
  constructor(
    private board: BoardService,
    private playerPiece: PlayerPieceService
  ) {
    super([]);
  }

  ngOnInit(): void {}
}
