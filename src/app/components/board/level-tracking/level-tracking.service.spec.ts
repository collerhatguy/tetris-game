import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Board, Row } from '../board-service/models';
import { RowClearingService } from '../row-clearing/row-clearing.service';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { LevelTrackingService } from './level-tracking.service';

describe('LevelTrackingService', () => {
  let service: LevelTrackingService;
  let rowsCleared: Subject<number>;

  beforeEach(() => {
    rowsCleared = new Subject();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RowClearingService,
          useValue: { rowsCleared$: rowsCleared.asObservable() },
        },
      ],
    });
    service = TestBed.inject(LevelTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts with a level of 1', () => {
    const spy = subscribeSpyTo(service.level);
    expect(spy.getLastValue()).toBe(1);
    spy.unsubscribe();
  });

  it('will increase in levels every time the player clears 10 rows', () => {
    const spy = subscribeSpyTo(service.level);
    rowsCleared.next(9);
    expect(spy.getLastValue()).toBe(1);
    rowsCleared.next(10);
    expect(spy.getLastValue()).toBe(2);
    spy.unsubscribe();
  });

  it('score will increase be 40 when 1 row is cleared at level 1', () => {
    const spy = subscribeSpyTo(service.score);
    rowsCleared.next(0);
    rowsCleared.next(1);
    expect(spy.getLastValue()).toBe(40);
    spy.unsubscribe();
  });
  it('score will increase by 100 when 2 rows are cleared at lvl 1', () => {
    const spy = subscribeSpyTo(service.score);
    rowsCleared.next(0);
    rowsCleared.next(2);
    expect(spy.getLastValue()).toBe(100);
    spy.unsubscribe();
  });
});
