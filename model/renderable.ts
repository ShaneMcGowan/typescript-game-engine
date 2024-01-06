/**
 * An object that can be rendered to the screen
 */
export interface Renderable {
  spriteX: number;
  spriteY: number;
  tileset: string;
  /*
    TODO(smg): animations, perhaps something like the following
    animation: {
      frames: number[];
      currentFrame: number;
      currentFrameTime: number;
      frameTime: number;
    };
  */
}