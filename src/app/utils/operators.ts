import { pipe, Observable, tap, map, filter } from 'rxjs';
import { copy } from './copy';
export const log = <T>() =>
  pipe<Observable<T>, Observable<T>>(tap((x) => console.log(copy(x))));

export const clone = <T>() =>
  pipe<Observable<T>, Observable<T>>(map((x) => copy(x)));

export const filterInputs = (keys: string[]) =>
  pipe<Observable<KeyboardEvent>, Observable<KeyboardEvent>>(
    filter((event) =>
      event.key ? keys.includes(event.key) : keys.includes(event.code)
    )
  );
