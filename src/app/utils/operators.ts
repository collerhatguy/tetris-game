import { pipe, Observable, tap, map } from 'rxjs';
import { copy } from './copy';
export const log = <T>() =>
  pipe<Observable<T>, Observable<T>>(tap((x) => console.log(copy(x))));

export const clone = <T>() =>
  pipe<Observable<T>, Observable<T>>(map((x) => copy(x)));
