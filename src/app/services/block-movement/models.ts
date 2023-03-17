import {
  Position,
  Shape,
} from 'src/app/components/board/block-generation/model';
import { Coordinate } from 'src/app/components/board/board-service/models';

export type Command = Direction | 'swap' | 'drop';

export type Direction = HorizontalDirection | RotationalDirection | 'down';

export type HorizontalDirection = 'left' | 'right';
export type RotationalDirection = 'rotateLeft' | 'rotateRight';

type AlternatePositions = Coordinate[];

type WallKickData = {
  [key in Position]: {
    [key in RotationalDirection]: AlternatePositions;
  };
};

export const rotationIndexs = new Map<Shape, number>()
  .set('I', 1)
  .set('J', 2)
  .set('L', 2)
  .set('S', 2)
  .set('T', 1)
  .set('Z', 2);

const alternatePositions1 = [
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: 2 },
  { x: -1, y: 2 },
];
const alternatePositions2 = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: -2 },
  { x: 1, y: -2 },
];
const alternatePositions3 = [
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -2 },
  { x: -1, y: -2 },
];
const alternatePositions4 = [
  { x: 1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
];

export const wallKickData: WallKickData = {
  '0': {
    rotateLeft: alternatePositions4,
    rotateRight: alternatePositions1,
  },
  R: {
    rotateLeft: alternatePositions2,
    rotateRight: alternatePositions2,
  },
  '2': {
    rotateLeft: alternatePositions1,
    rotateRight: alternatePositions4,
  },
  L: {
    rotateLeft: alternatePositions3,
    rotateRight: alternatePositions3,
  },
};
