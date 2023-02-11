type Color = 'white' | 'black' | 'orange';

export interface Square {
  color: Color;
  isPlayer: boolean;
  solid: boolean;
}

export type Row = Square[];
export type Board = Row[];

export interface Coordinate {
  x: number;
  y: number;
}

export type Block = Coordinate[];

export function createEmptyBlock(): Square {
  return {
    solid: false,
    isPlayer: false,
    color: 'white',
  };
}

export function createSolidBlock(): Square {
  return {
    solid: true,
    isPlayer: false,
    color: 'orange',
  };
}

export function createShadowBlock(): Square {
  return {
    solid: false,
    isPlayer: false,
    color: 'orange',
  };
}

export function createPlayerBlock(): Square {
  return {
    solid: true,
    isPlayer: true,
    color: 'orange',
  };
}
