import { Injectable } from '@angular/core';
import { map, mergeMap, pairwise, scan, startWith, withLatestFrom } from 'rxjs';
import { log } from 'src/app/utils/operators';
import { RowClearingService } from '../row-clearing/row-clearing.service';

@Injectable({
  providedIn: 'root',
})
export class LevelTrackingService {
  constructor(private clearing: RowClearingService) {}

  level = this.clearing.rowsCleared$.pipe(
    map((rows) => Math.floor(rows / 10) + 1),
    startWith(1)
  );

  private rowsJustCleared = this.clearing.rowsCleared$.pipe(
    pairwise(),
    map(([prev, curr]) => curr - prev)
  );

  private rowScoreMap = new Map<number, number>()
    .set(1, 40)
    .set(2, 100)
    .set(3, 300)
    .set(4, 1200);

  score = this.rowsJustCleared.pipe(
    withLatestFrom(this.level),
    map(
      ([numberCleared, level]) => this.rowScoreMap.get(numberCleared)! * level
    ),
    scan((totalScore, addition) => totalScore + addition, 0),
    startWith(0),
    log()
  );
}
