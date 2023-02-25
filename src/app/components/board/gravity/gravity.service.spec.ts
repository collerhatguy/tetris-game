import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { GravityService } from './gravity.service';

describe('GravityService', () => {
  let service: GravityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('increases emissions based on level', () => {
    const spy = subscribeSpyTo(service.gravity);
  });
});
