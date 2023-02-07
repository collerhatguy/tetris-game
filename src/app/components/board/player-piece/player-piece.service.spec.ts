import { TestBed } from '@angular/core/testing';

import { PlayerPieceService } from './player-piece.service';

describe('PlayerPieceService', () => {
  let service: PlayerPieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerPieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
