import { TestBed } from '@angular/core/testing';
import {
  BlockBuilder,
  Tetronomo,
} from 'src/app/components/board/block-generation/model';
import { BoardService } from 'src/app/components/board/board-service/board.service';

import { ValidateMovementService } from './validate-movement.service';

describe('ValidateMovementService', () => {
  let service: ValidateMovementService;
  let board: BoardService;
  BoardService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardService],
    });
    service = TestBed.inject(ValidateMovementService);
    board = TestBed.inject(BoardService);
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

  it('will return a move is valid if there are no previous blocks there', () => {
    const valid = service.isValidMove([], [{ x: 0, y: 0 }]);
    expect(valid).toBeTrue();
  });

  it('it will return false if another block is in the area', () => {
    const block = new BlockBuilder({ x: 0, y: 0 }).done();
    board.lockPieceInplace(block);
    const valid = service.isValidMove([], block);
    expect(valid).toBeFalse();
  });

  it('will not return false if the player overlaps with thier previous position', () => {
    const block = new BlockBuilder({ x: 0, y: 0 }).addBlockBelow().done();
    const block2 = new BlockBuilder({ x: 0, y: 1 }).addBlockBelow().done();
    board.movePiece(new Tetronomo(), block);
    const valid = service.isValidMove(block, block2);
    expect(valid).toBeTrue();
  });
});
