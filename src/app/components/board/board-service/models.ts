type Color = 'white' | 'black' | 'orange';

export interface Square {
  color: Color;
  isPlayer: boolean;
}

export type Row = Square[];
export type Board = Row[];

export interface Coordinate {
  x: number;
  y: number;
}
