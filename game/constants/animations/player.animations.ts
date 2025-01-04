export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

export interface Animation {
  tileset: string;
  length: number;
  frames: AnimationFrame[],
}

export interface AnimationFrame {
  x: number,
  y: number,
  width: number, // TODO: should width and height be in Animation instead of per frame?
  height: number,
}

type PlayerActionAnimation = Record<Direction, Animation>; 

export class AnimationsPlayer {

  static readonly UseHoe: PlayerActionAnimation = {
    [Direction.Up]: {
      tileset: 'tileset_actions',
      length: 0.5,
      frames: [
        {
          x: 1,
          y: 3,
          width: 1,
          height: 3,
        },
        {
          x: 4,
          y: 3,
          width: 1,
          height: 3,
        }
      ]
    },
    [Direction.Down]: {
      tileset: 'tileset_actions',
      length: 0.5,
      frames: [
        {
          x: 1,
          y: 0,
          width: 1,
          height: 3,
        },
        {
          x: 4,
          y: 0,
          width: 1,
          height: 3,
        }
      ]
    },
    [Direction.Left]: {
      tileset: 'tileset_actions',
      length: 0.5,
      frames: [
        {
          x: 1,
          y: 6,
          width: 1,
          height: 3,
        },
        {
          x: 4,
          y: 6,
          width: 1,
          height: 3,
        }
      ]
    },
    [Direction.Right]: {
      tileset: 'tileset_actions',
      length: 0.5,
      frames: [
        {
          x: 1,
          y: 9,
          width: 1,
          height: 3,
        },
        {
          x: 4,
          y: 9,
          width: 1,
          height: 3,
        }
      ]
    }
  }
};