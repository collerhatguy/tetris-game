import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, Observable } from 'rxjs';
import { BlockGenerationService } from './block-generation/block-generation.service';
import { BoardService } from './board-service/board.service';
import { LevelTrackingService } from './level-tracking/level-tracking.service';
import { PlayerPieceService } from './player-piece/player-piece.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy, OnInit {
  board$ = this.board.state$;

  level$ = this.level.level;

  score$ = this.level.score;

  private destroy = new Subject();

  constructor(
    private level: LevelTrackingService,
    private playerPiece: PlayerPieceService,
    private board: BoardService,
    public gen: BlockGenerationService
  ) {}

  private subscribe(obs: Observable<any>) {
    obs.pipe(takeUntil(this.destroy)).subscribe();
  }

  ngOnInit(): void {
    this.subscribe(this.playerPiece.updateBoardBasedOnPiece);
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }
}
