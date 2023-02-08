import { TestBed } from '@angular/core/testing';

import { PlayerInputService } from './player-input.service';

describe('PlayerInputService', () => {
  let service: PlayerInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
