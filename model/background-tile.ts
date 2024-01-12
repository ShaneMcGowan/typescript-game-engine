import { Renderable } from "./renderable";

export interface BackgroundTile extends Renderable {}

export interface BackgroundTile2 {
  tileset: string;
  animationFrameDuration: number; // length of animation in seconds
  animationFrames: {spriteX: number, spriteY: number}[],
  animationMap: number[] // length of each animation frame in seconds, index matching animationFrames
}

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