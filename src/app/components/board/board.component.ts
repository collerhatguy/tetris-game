import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Observable,
  interval,
  map,
  BehaviorSubject,
  pipe,
  tap,
  Subject,
  pairwise,
  takeUntil,
} from 'rxjs';
import { BoardService } from './board-service/board.service';
import { PlayerPieceService } from './player-piece/player-piece.service';

const log = <T>() =>
  pipe<Observable<T>, Observable<T>>(
    tap((x) => console.log(JSON.parse(JSON.stringify(x))))
  );

const clone = <T>() =>
  pipe<Observable<T>, Observable<T>>(map((x) => JSON.parse(JSON.stringify(x))));
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy, OnInit {
  board$ = this.board.value$;

  private destroy = new Subject();

  gravity = interval(1000).pipe(
    takeUntil(this.destroy),
    tap(() => this.playerPiece.moveDown())
  );

  constructor(
    private playerPiece: PlayerPieceService,
    private board: BoardService
  ) {}
  ngOnInit(): void {
    this.gravity.subscribe();
    this.playerPiece.value$
      .pipe(clone(), pairwise(), takeUntil(this.destroy))
      .subscribe(([prev, current]) => {
        const hitGround = current.length === 0;
        hitGround
          ? this.board.lockPieceInplace(prev)
          : this.board.clearPiece(prev);
        this.board.setPiece(current);
      });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
  }
}
