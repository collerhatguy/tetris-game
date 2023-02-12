import { Injectable } from '@angular/core';
import { BoardService } from '../board-service/board.service';
import { Block } from '../board-service/models';

@Injectable({
  providedIn: 'root',
})
export class BlockGenerationService {
  constructor(private board: BoardService) {}

  private readonly creationIndex = Math.floor(this.board.boardWidth / 2);

  private readonly sqaureBlock = [
    { x: this.creationIndex, y: 0 },
    { x: this.creationIndex + 1, y: 0 },
    { x: this.creationIndex, y: 1 },
    { x: this.creationIndex + 1, y: 1 },
  ];

  private readonly lineBlock = [
    { x: this.creationIndex, y: 0 },
    { x: this.creationIndex, y: 1 },
    { x: this.creationIndex, y: 2 },
    { x: this.creationIndex, y: 3 },
  ];

  private allBlocks: Block[] = [
    this.sqaureBlock,
    this.lineBlock,
    // have not been created yet
    [],
    [],
    [],
    [],
    [],
  ];

  private blockBag = [...this.allBlocks];

  getNextBlock(): Block {
    const random = Math.random();
    const index = Math.floor(random * this.blockBag.length);
    const [nextBlock] = this.blockBag.splice(index, 1);
    if (this.blockBag.length === 0) this.blockBag = [...this.allBlocks];
    return nextBlock;
  }
}
