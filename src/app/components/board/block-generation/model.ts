import { Block, Coordinate } from '../board-service/models';

export class BlockBuilder {
  constructor(private initialPoint: Coordinate) {}

  private block: Block = [this.initialPoint];

  done() {
    const finalBlock = [...this.block];
    this.block = [this.initialPoint];
    return new Tetronomo(...finalBlock);
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

type Position = '0' | 'R' | '2' | 'L';

export class Tetronomo extends Array<Coordinate> {
  private positions: Position[] = ['0', 'R', '2', 'L'];
  private _position: number = 0;

  get position(): Position {
    return this.positions.at(this._position)!;
  }

  rotateRight() {
    this._position = (this._position + 1) % this.positions.length;
  }
  rotateLeft() {
    this._position = (this._position - 1) % this.positions.length;
  }

  constructor(...args: Coordinate[]) {
    super(...args);
  }
  static moveDown(block: Tetronomo) {
    return new Tetronomo(...block.map((c) => ({ ...c, y: c.y + 1 })));
  }
  static moveLeft(block: Tetronomo) {
    return new Tetronomo(...block.map((c) => ({ ...c, x: c.x - 1 })));
  }
  static moveRight(block: Tetronomo) {
    return new Tetronomo(...block.map((c) => ({ ...c, x: c.x + 1 })));
  }
}
