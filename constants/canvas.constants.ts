/**
 * For landscape devices (the only ones I am willing to suppport for now), we should calculate device aspect ratio then set CANVIS_TILE_WIDTH based off that + CANVIS_TILE_HEIGHT
 * This means "resolution" will still be low but we can fill the full monitor, we also need to set canvas.width along with this value. should be done on initialisation and also window resizing
 * Leave as hardcoded value for now
*/
export class CanvasConstants {
  // an odd number width and height allows player character to be rendered in direct center of screen if you are doing a player following camera
  // this is effectively the resolution of the game, text scales with it so can't increase it too much
  
  static readonly CANVIS_TILE_HEIGHT = 15; // total height in tiles
  static readonly CANVIS_TILE_WIDTH = 21; // total width in tiles
  static readonly TILE_SIZE: number = 16; // pixel size of tile (32px x 32px)

  /**
   * Keep an eye on this and any getters, don't run it on hot code paths
   */
  static get CANVAS_HEIGHT(): number {
    return CanvasConstants.TILE_SIZE * CanvasConstants.CANVIS_TILE_HEIGHT;
  }

  static get CANVAS_WIDTH(): number {
    return CanvasConstants.TILE_SIZE * CanvasConstants.CANVIS_TILE_WIDTH;
  }

  static get CANVIS_CENTER_TILE_Y(): number {
    return Math.floor(this.CANVIS_TILE_HEIGHT / 2);
  }

  static get CANVIS_CENTER_TILE_X(): number {
    return Math.floor(this.CANVIS_TILE_WIDTH / 2);
  }

}