import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, Observable } from 'rxjs';
import { BoardService } from './board-service/board.service';
import { PlayerPieceService } from './player-piece/player-piece.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy, OnInit {
  board$ = this.board.state$;

  private destroy = new Subject();

  constructor(
    private playerPiece: PlayerPieceService,
    private board: BoardService
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
