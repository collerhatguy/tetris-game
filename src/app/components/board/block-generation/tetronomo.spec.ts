import { BlockBuilder, Tetronomo } from './model';

describe('teronomo', () => {
  let tetro: Tetronomo;
  beforeEach(() => {
    tetro = new Tetronomo({ x: 0, y: 0 });
  });
  describe('postion', () => {
    it('starts with 0', () => {
      expect(tetro.position).toBe('0');
    });
    it('will be R if rotated right', () => {
      tetro.rotate('rotateRight');
      expect(tetro.position).toBe('R');
    });
    it('will be 2 if rotated right twice', () => {
      tetro.rotate('rotateRight');
      tetro.rotate('rotateRight');
      expect(tetro.position).toBe('2');
    });
    it('will be L if rotated right thrice', () => {
      tetro.rotate('rotateRight');
      tetro.rotate('rotateRight');
      tetro.rotate('rotateRight');
      expect(tetro.position).toBe('L');
    });
    it('will be 0 if rotated right four times', () => {
      tetro.rotate('rotateRight');
      tetro.rotate('rotateRight');
      tetro.rotate('rotateRight');
      tetro.rotate('rotateRight');
      expect(tetro.position).toBe('0');
    });
    it('will be L if rotated right left', () => {
      tetro.rotate('rotateLeft');
      expect(tetro.position).toBe('L');
    });
    it('if a prev positon is provided it will rotate from that postion', () => {
      tetro.rotate('rotateRight', '2');
      expect(tetro.position).toBe('L');
    });
    it('maintains the right rotation if moved down', () => {
      tetro.rotate('rotateLeft');
      const res = Tetronomo.moveDown(tetro);
      expect(res.position === 'L').toBeTrue();
    });
    it('maintains the shape when moved', () => {
      tetro.shape = 'S';
      const res = Tetronomo.moveDown(tetro);
      expect(res.shape === 'S').toBeTrue();
    });
    it('can be moved down', () => {
      const res = Tetronomo.moveDown(tetro);
      const expected = new Tetronomo({ x: 0, y: 1 });
      expect(res).toEqual(expected);
    });
  });
});
