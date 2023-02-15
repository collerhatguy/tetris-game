import { TestBed } from '@angular/core/testing';
import { BoardService } from '../board-service/board.service';
import { PlayerPieceService } from '../player-piece/player-piece.service';

import { ShadowPieceService } from './shadow-piece.service';

describe('ShadowPieceService', () => {
  let service: ShadowPieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerPieceService, BoardService],
    });
    service = TestBed.inject(ShadowPieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('does not run infinitly when an empty array is passed', () => {
    const res = service.calculateShadowBlock([]);
    expect(res).toEqual([]);
  });
});
