import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
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
    .addBlockRight()
    .addBlockRight()
    .addBlockRight()
    .done('I');

  private readonly SBlock = this.blockBuilder
    .addBlockLeft()
    .addBlockBelow()
    .addBlockLeft()
    .done('S');

  private readonly ZBlock = this.blockBuilder
    .addBlockRight()
    .addBlockBelow()
    .addBlockRight()
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

  private shuffleArray<T>(array: T[]): T[] {
    const newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  private blockBag = new BehaviorSubject(this.shuffleArray(this.allBlocks));

  savedTetro: Shape | undefined;

  private canSwap = true;

  teronomoPreview = this.blockBag
    .asObservable()
    .pipe(map((bag) => bag.slice(0, 6)));

  swapBlock(tetro: Tetronomo): Tetronomo {
    if (!this.canSwap) return tetro;
    if (!this.savedTetro) {
      this.savedTetro = tetro.shape;
      const newTetro = this.getNextBlock();
      this.canSwap = false;
      return this.movement.replaceTetronome(tetro, newTetro);
    }

    const newTetro = this.allBlocks.find((t) => t.shape === this.savedTetro)!;
    this.savedTetro = tetro.shape;
    this.canSwap = false;
    return this.movement.replaceTetronome(tetro, newTetro);
  }

  getNextBlock(): Tetronomo {
    const currentBag = this.blockBag.value;
    const nextBlock = currentBag.shift()!;
    if (currentBag.length < 6) {
      const nextBlocks = this.shuffleArray(this.allBlocks);
      currentBag.push(...nextBlocks);
      this.blockBag.next(currentBag);
    }
    this.canSwap = true;
    return nextBlock;
  }
}
