import { Injectable } from '@angular/core';
import { fromEvent, throttleTime, map, Observable, merge } from 'rxjs';
import { filterInputs } from 'src/app/utils/operators';
import { Direction } from '../block-movement/models';
import {
  allInputs,
  downInputs,
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

  private leftInput: Observable<'left'> = this.significantInputs.pipe(
    filterInputs(leftInputs),
    map(() => 'left')
  );

  private rightInput: Observable<'right'> = this.significantInputs.pipe(
    filterInputs(rightInputs),
    map(() => 'right')
  );

  private downInput: Observable<'down'> = this.keyEvents.pipe(
    filterInputs(downInputs),
    map(() => 'down')
  );

  input: Observable<Direction> = merge(
    this.downInput,
    this.leftInput,
    this.rightInput
  );

  constructor() {}
}
