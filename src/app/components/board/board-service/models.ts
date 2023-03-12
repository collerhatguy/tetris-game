import { Shape } from '../block-generation/model';

type Color =
  | 'white'
  | 'black'
  | 'DarkOrange'
  | 'DarkBlue'
  | 'Gold'
  | 'DarkMagenta'
  | 'DarkGreen'
  | 'DarkRed'
  | 'Cyan';

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

export function createSolidBlock(shape: Shape): Square {
  return {
    solid: true,
    isPlayer: false,
    color: shapeToColorMap.get(shape)!,
  };
}

export function createShadowBlock(shape: Shape): Square {
  return {
    solid: false,
    isPlayer: false,
    color: shapeToColorMap.get(shape)!,
  };
}

const shapeToColorMap = new Map<Shape, Color>()
  .set('O', 'Gold')
  .set('I', 'Cyan')
  .set('L', 'DarkBlue')
  .set('Z', 'DarkRed')
  .set('T', 'DarkMagenta')
  .set('S', 'DarkGreen')
  .set('J', 'DarkOrange');

export function createPlayerBlock(shape: Shape): Square {
  return {
    solid: true,
    isPlayer: true,
    color: shapeToColorMap.get(shape)!,
  };
}
