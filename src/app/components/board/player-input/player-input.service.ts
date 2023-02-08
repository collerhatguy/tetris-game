import { Injectable } from '@angular/core';
import { fromEvent, filter, throttleTime, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerInputService {
  private keyEvents = fromEvent<KeyboardEvent>(window, 'keydown');

  leftInput = this.keyEvents.pipe(
    filter((e) => e.key === 'a'),
    throttleTime(200),
    tap(() => console.count('key event'))
  );

  constructor() {}
}
