import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of, BehaviorSubject } from 'rxjs';
import { PlayerInputService } from 'src/app/services/player-input/player-input.service';
import { LevelTrackingService } from '../level-tracking/level-tracking.service';

import { GravityService } from './gravity.service';

describe('GravityService', () => {
  let service: GravityService;
  let level: BehaviorSubject<number>;
  beforeEach(() => {
    level = new BehaviorSubject(1);
    TestBed.configureTestingModule({
      providers: [
        PlayerInputService,
        {
          provide: LevelTrackingService,
          useValue: {
            level: level.asObservable(),
          },
        },
      ],
    });
    service = TestBed.inject(GravityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('by default emits every second or so', fakeAsync(() => {
    const spy = subscribeSpyTo(service.gravity);
    tick(1020);
    expect(spy.getValuesLength()).toBe(1);
    spy.unsubscribe();
  }));

  it('will emit faster when the level goes up', fakeAsync(() => {
    level.next(2);
    const spy = subscribeSpyTo(service.gravity);
    tick(800);
    expect(spy.getValuesLength()).toBe(1);
    tick(800);
    expect(spy.getValuesLength()).toBe(2);
    tick(800);
    expect(spy.getValuesLength()).toBe(3);
    spy.unsubscribe();
  }));
});
