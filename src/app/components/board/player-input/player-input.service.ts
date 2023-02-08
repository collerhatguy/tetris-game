import { Injectable } from '@angular/core';
import { fromEvent, filter, throttleTime, tap } from 'rxjs';
import { filterInputs } from 'src/app/utils/operators';
import { allInputs, inputsPerSecond } from './constants';

@Injectable({
  providedIn: 'root',
})
export class PlayerInputService {
  private keyEvents = fromEvent<KeyboardEvent>(window, 'keydown');

  private significantInputs = this.keyEvents.pipe(
    filterInputs(allInputs),
    throttleTime(1000 / inputsPerSecond)
  );

  leftInput = this.significantInputs.pipe(filter((e) => e.key === 'a'));
  rightInput = this.significantInputs.pipe(filter((e) => e.key === 'd'));

  constructor() {}
}
