import { Block, Coordinate } from '../board-service/models';

export class BlockBuilder {
  constructor(private initialPoint: Coordinate) {}

  private block: Block = [this.initialPoint];

  done() {
    const finalBlock = [...this.block];
    this.block = [this.initialPoint];
    return finalBlock;
  }

  addBlockBelow() {
    const { x, y } = this.block.at(-1) as Coordinate;
    this.block.push({ x, y: y + 1 });
    return this;
  }
  addBlockAbove() {
    const { x, y } = this.block.at(-1) as Coordinate;
    this.block.push({ x, y: y - 1 });
    return this;
  }
  addBlockLeft() {
    const { x, y } = this.block.at(-1) as Coordinate;
    this.block.push({ x: x - 1, y });
    return this;
  }
  addBlockRight() {
    const { x, y } = this.block.at(-1) as Coordinate;
    this.block.push({ x: x + 1, y });
    return this;
  }
  addBlockLeftAndRight() {
    const { x, y } = this.block.at(-1) as Coordinate;
    this.block.push({ x: x + 1, y }, { x: x - 1, y });
    return this;
  }
}

export class Tetronomo {
  static moveDown(block: Block) {
    return block.map((c) => ({ ...c, y: c.y + 1 }));
  }
  static moveLeft(block: Block) {
    return block.map((c) => ({ ...c, x: c.x - 1 }));
  }
  static moveRight(block: Block) {
    return block.map((c) => ({ ...c, x: c.x + 1 }));
  }
}
