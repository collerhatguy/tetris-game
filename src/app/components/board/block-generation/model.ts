import { Block, Coordinate } from '../board-service/models';

export class BlockBuilder {
  constructor(private initialPoint: Coordinate) {}

  private block: Block = [this.initialPoint];

  done(shape?: Shape) {
    const finalBlock = [...this.block];
    this.block = [this.initialPoint];
    const res = new Tetronomo(...finalBlock);
    if (shape) res.shape = shape;
    return res;
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
export type Shape = 'O' | 'I' | 'J' | 'L' | 'S' | 'Z' | 'T';
export class Tetronomo extends Array<Coordinate> {
  shape: Shape = 'I';
  private positions: Position[] = ['0', 'R', '2', 'L'];
  private _position: number = 0;

  get position(): Position {
    return this.positions.at(this._position)!;
  }

  rotateRight(prev?: Position) {
    const initialPosition = prev
      ? this.positions.indexOf(prev)
      : this._position;
    this._position = initialPosition + 1;
    if (this._position > this.positions.length - 1) this._position = 0;
  }
  rotateLeft(prev?: Position) {
    const initialPosition = prev
      ? this.positions.indexOf(prev)
      : this._position;
    this._position = initialPosition - 1;
    if (this._position < 0) this._position = this.positions.length - 1;
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
