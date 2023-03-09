import { Injectable } from '@angular/core';
import { map, startWith } from 'rxjs';
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
}
