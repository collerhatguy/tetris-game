import { Injectable } from '@angular/core';
import { BoardService } from '../board-service/board.service';
import { Block } from '../board-service/models';
import { BlockBuilder } from './model';

@Injectable({
  providedIn: 'root',
})
export class BlockGenerationService {
  constructor(private board: BoardService) {}

  private readonly creationIndex = Math.floor(this.board.boardWidth / 2);

  private blockBuilder = new BlockBuilder({ x: this.creationIndex, y: 0 });

  private readonly sqaureBlock = this.blockBuilder
    .addBlockRight()
    .addBlockBelow()
    .addBlockLeft()
    .done();

  private readonly lineBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockBelow()
    .addBlockBelow()
    .done();

  private readonly SBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockRight()
    .addBlockBelow()
    .done();

  private readonly ZBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockLeft()
    .addBlockBelow()
    .done();

  private readonly JBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockRight()
    .addBlockRight()
    .done();

  private readonly LBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockLeft()
    .addBlockLeft()
    .done();

  private readonly TBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockLeftAndRight()
    .done();

  private allBlocks: Block[] = [
    this.sqaureBlock,
    this.lineBlock,
    this.JBlock,
    this.LBlock,
    this.SBlock,
    this.ZBlock,
    this.TBlock,
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