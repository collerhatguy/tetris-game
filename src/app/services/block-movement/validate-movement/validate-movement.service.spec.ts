import { TestBed } from '@angular/core/testing';

import { ValidateMovementService } from './validate-movement.service';

describe('ValidateMovementService', () => {
  let service: ValidateMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('does not break if you pass it out of bound values', () => {
    let valid = service.isValidMove([], [{ x: 100, y: 0 }]);
    expect(valid).toBeFalse();
    valid = service.isValidMove([], [{ x: 0, y: 200 }]);
    expect(valid).toBeFalse();
    valid = service.isValidMove([], [{ x: 0, y: -1 }]);
    expect(valid).toBeFalse();
  });
});
