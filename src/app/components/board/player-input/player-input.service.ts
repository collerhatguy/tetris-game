import { Injectable } from '@angular/core';
import { fromEvent, throttleTime } from 'rxjs';
import { filterInputs } from 'src/app/utils/operators';
import {
  allInputs,
  inputsPerSecond,
  leftInputs,
  rightInputs,
} from './constants';

@Injectable({
  providedIn: 'root',
})
export class PlayerInputService {
  private keyEvents = fromEvent<KeyboardEvent>(window, 'keydown');

  private significantInputs = this.keyEvents.pipe(
    filterInputs(allInputs),
    throttleTime(1000 / inputsPerSecond)
  );

  leftInput = this.significantInputs.pipe(filterInputs(leftInputs));
  rightInput = this.significantInputs.pipe(filterInputs(rightInputs));

  constructor() {}
}
