import { TestBed } from '@angular/core/testing';

import { BlockMovementService } from './block-movement.service';

describe('BlockMovementService', () => {
  let service: BlockMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
