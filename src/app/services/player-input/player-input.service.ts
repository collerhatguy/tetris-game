import { Injectable } from '@angular/core';
import { fromEvent, throttleTime, map, Observable, merge } from 'rxjs';
import { filterInputs } from 'src/app/utils/operators';
import { Command, Direction } from '../block-movement/models';
import {
  throttledInputs,
  downInputs,
  inputsPerSecond,
  leftInputs,
  rightInputs,
  rotateLeftInputs,
  rotateRightInputs,
  swapBlockInput,
} from './constants';

@Injectable({
  providedIn: 'root',
})
export class PlayerInputService {
  private keyEvents = fromEvent<KeyboardEvent>(window, 'keydown');

  private significantInputs = this.keyEvents.pipe(
    filterInputs(throttledInputs),
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

  private rotateLeftInput: Observable<'rotateLeft'> = this.keyEvents.pipe(
    filterInputs(rotateLeftInputs),
    map(() => 'rotateLeft')
  );

  private rotateRightInput: Observable<'rotateRight'> = this.keyEvents.pipe(
    filterInputs(rotateRightInputs),
    map(() => 'rotateRight')
  );

  private swapTetroInput: Observable<'swap'> = this.keyEvents.pipe(
    filterInputs(swapBlockInput),
    map(() => 'swap')
  );

  input: Observable<Command> = merge(
    this.downInput,
    this.leftInput,
    this.rightInput,
    this.rotateLeftInput,
    this.rotateRightInput,
    this.swapTetroInput
  );

  constructor() {}
}
