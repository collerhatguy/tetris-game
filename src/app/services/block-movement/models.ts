import { Position } from 'src/app/components/board/block-generation/model';
import { Coordinate } from 'src/app/components/board/board-service/models';

export type Direction = HorizontalDirection | RotationalDirection | 'down';

export type HorizontalDirection = 'left' | 'right';
export type RotationalDirection = 'rotateLeft' | 'rotateRight';

type AlternatePositions = Coordinate[];

type WallKickData = {
  [key in Position]: {
    [key in RotationalDirection]: AlternatePositions;
  };
};

export const wallKickData: WallKickData = {
  '0': {
    rotateLeft: [{ x: -1, y: 0 }],
    rotateRight: [{ x: 1, y: 0 }],
  },
  R: {
    rotateLeft: [{ x: 1, y: 0 }],
    rotateRight: [{ x: 1, y: 0 }],
  },
  '2': {
    rotateLeft: [{ x: -1, y: 0 }],
    rotateRight: [{ x: 1, y: 0 }],
  },
  L: {
    rotateLeft: [{ x: -1, y: 0 }],
    rotateRight: [{ x: -1, y: 0 }],
  },
};
