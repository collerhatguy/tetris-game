import { Injectable } from '@angular/core';
import { BlockMovementService } from 'src/app/services/block-movement/block-movement.service';
import { BoardService } from '../board-service/board.service';
import { BlockBuilder, Shape, Tetronomo } from './model';

@Injectable({
  providedIn: 'root',
})
export class BlockGenerationService {
  constructor(
    private board: BoardService,
    private movement: BlockMovementService
  ) {}

  private readonly creationIndex = Math.floor(this.board.boardWidth / 2);

  private blockBuilder = new BlockBuilder({ x: this.creationIndex, y: 0 });

  private readonly sqaureBlock = this.blockBuilder
    .addBlockRight()
    .addBlockBelow()
    .addBlockLeft()
    .done('O');

  private readonly lineBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockBelow()
    .addBlockBelow()
    .done('I');

  private readonly SBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockRight()
    .addBlockBelow()
    .done('S');

  private readonly ZBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockLeft()
    .addBlockBelow()
    .done('Z');

  private readonly JBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockRight()
    .addBlockRight()
    .done('J');

  private readonly LBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockLeft()
    .addBlockLeft()
    .done('L');

  private readonly TBlock = this.blockBuilder
    .addBlockBelow()
    .addBlockLeftAndRight()
    .done('T');

  private allBlocks: Tetronomo[] = [
    this.sqaureBlock,
    this.lineBlock,
    this.JBlock,
    this.LBlock,
    this.SBlock,
    this.ZBlock,
    this.TBlock,
  ];

  private blockBag = [...this.allBlocks];

  private savedTetro: Shape | undefined;

  private canSwap = true;

  swapBlock(tetro: Tetronomo): Tetronomo {
    if (!this.canSwap) return tetro;
    if (!this.savedTetro) {
      this.savedTetro = tetro.shape;
      const newTetro = this.getNextBlock();
      return this.movement.replaceTetronome(tetro, newTetro);
    }

    const newTetro = this.allBlocks.find((t) => t.shape === this.savedTetro)!;
    this.savedTetro = tetro.shape;
    return this.movement.replaceTetronome(tetro, newTetro);
  }

  getNextBlock(): Tetronomo {
    const random = Math.random();
    const index = Math.floor(random * this.blockBag.length);
    const [nextBlock] = this.blockBag.splice(index, 1);
    if (this.blockBag.length === 0) this.blockBag = [...this.allBlocks];
    this.canSwap = false;
    return nextBlock;
  }
}
