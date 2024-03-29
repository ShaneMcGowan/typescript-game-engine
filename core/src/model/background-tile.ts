export interface BackgroundTile {
  tileset: string;
  animationFrameDuration: number; // length of animation in seconds
  animationFrames: Array<{ spriteX: number; spriteY: number; }>;
  animationMap: number[]; // length of each animation frame in seconds, index matching animationFrames
}

export const BASE_BACKGROUND_TILE: BackgroundTile = {
  tileset: '',
  animationFrameDuration: 1,
  animationFrames: [{ spriteX: 0, spriteY: 0, }],
  animationMap: [1],
};

/*
const TEST_TILE = {
  tileset: 'tileset_water',
  animationFrameDuration: 1,
  animationFrames: [
    {spriteX: 0, spriteY: 0},
    {spriteX: 0, spriteY: 1},
    {spriteX: 0, spriteY: 2},
    {spriteX: 0, spriteY: 3}
  ],
  animationMap: [
    0.25,
    0.5,
    0.75,
    1
  ]
}
*/
