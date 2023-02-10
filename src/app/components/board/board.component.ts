import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  interval,
  tap,
  Subject,
  pairwise,
  takeUntil,
  switchMap,
  startWith,
} from 'rxjs';
import { BoardService } from './board-service/board.service';
import { PlayerInputService } from '../../services/player-input/player-input.service';
import { PlayerPieceService } from './player-piece/player-piece.service';
import { clone } from '../../utils/operators';
import { ShadowPieceService } from './shadow-piece/shadow-piece.service';
import { Square } from './board-service/models';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy, OnInit {
  board$ = this.board.state$;

  private destroy = new Subject();

  gravity = this.inputs.downInput.pipe(
    startWith(''),
    takeUntil(this.destroy),
    switchMap(() =>
      interval(1000).pipe(
        takeUntil(this.destroy),
        tap(() => this.playerPiece.moveDown())
      )
    )
  );

  constructor(
    private playerPiece: PlayerPieceService,
    private shadowPiece: ShadowPieceService,
    private board: BoardService,
    private inputs: PlayerInputService
  ) {}

  ngOnInit(): void {
    this.gravity.subscribe();
    this.shadowPiece.trackPlayerPiece.pipe(takeUntil(this.destroy)).subscribe();
    this.inputs.leftInput
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.playerPiece.moveLeft());
    this.inputs.rightInput
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.playerPiece.moveRight());
    this.inputs.downInput
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.playerPiece.moveDown());
    this.playerPiece.state$
      .pipe(clone(), pairwise(), takeUntil(this.destroy))
      .subscribe(([prev, current]) => {
        const hitGround = current.length === 0;
        hitGround
          ? this.board.lockPieceInplace(prev)
          : this.board.clearPiece(prev);
        this.board.setPlayerPiece(current);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }
}
