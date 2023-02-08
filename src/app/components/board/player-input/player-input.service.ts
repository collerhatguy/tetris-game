import { Injectable } from '@angular/core';
import { fromEvent, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerInputService {
  private keyEvents = fromEvent<KeyboardEvent>(document, 'keydown');

  leftInput = this.keyEvents.pipe(filter((e) => e.key === 'a'));

  constructor() {}
}
