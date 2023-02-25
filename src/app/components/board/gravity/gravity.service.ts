import { Injectable } from '@angular/core';
import { filter, interval, map, Observable, startWith, switchMap } from 'rxjs';
import { PlayerInputService } from 'src/app/services/player-input/player-input.service';
import { LevelTrackingService } from '../level-tracking/level-tracking.service';

@Injectable({
  providedIn: 'root',
})
export class GravityService {
  constructor(
    private playerInput: PlayerInputService,
    private levelTracking: LevelTrackingService
  ) {}

  gravity: Observable<'down'> = this.playerInput.input.pipe(
    filter((direction) => direction === 'down'),
    startWith(''),
    switchMap(() => interval(1000).pipe(map(() => 'down' as const)))
  );
}
