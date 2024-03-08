export const DEFAULT_PIPE_SPEED: number = 4;
export const DEFAULT_PLAYER_GRAVITY: number = 48;
export const DEFAULT_PLAYER_ACCELERATION: number = -12;
export const DEFAULT_PIPE_GAP: number = 3; // gap between pipes
export const DEFAULT_PIPE_REGION: number = 8; // only ever move within X tiles

export abstract class DefaultsConstants {
  static readonly DEFAULT_PIPE_SPEED: number = DEFAULT_PIPE_SPEED;
  static readonly DEFAULT_PLAYER_GRAVITY: number = DEFAULT_PLAYER_GRAVITY;
  static readonly DEFAULT_PLAYER_ACCELERATION: number = DEFAULT_PLAYER_ACCELERATION;
  static DEFAULT_PIPE_GAP: number = DEFAULT_PIPE_GAP;
  static readonly DEFAULT_PIPE_REGION: number = DEFAULT_PIPE_REGION;
}
