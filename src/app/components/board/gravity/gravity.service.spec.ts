import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { of } from 'rxjs';
import { PlayerInputService } from 'src/app/services/player-input/player-input.service';
import { LevelTrackingService } from '../level-tracking/level-tracking.service';

import { GravityService } from './gravity.service';

describe('GravityService', () => {
  let service: GravityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayerInputService,
        {
          provide: LevelTrackingService,
          useValue: {
            level: of(1),
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
});
