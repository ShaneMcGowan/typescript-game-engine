/**
 * For landscape devices (the only ones I am willing to suppport for now), we should calculate device aspect ratio then set CANVIS_TILE_WIDTH based off that + CANVIS_TILE_HEIGHT
 * This means "resolution" will still be low but we can fill the full monitor, we also need to set canvas.width along with this value. should be done on initialisation and also window resizing
 * Leave as hardcoded value for now
*/
export class CanvasConstants {
  // 18 / 30
  static readonly CANVAS_TILE_HEIGHT = 18; // total height in tiles
  static readonly CANVAS_TILE_WIDTH = 30; // total width in tiles
  static readonly TILE_SIZE: number = 16; // e.g. 32 means a pixel size of tile (32px x 32px)
  static readonly OBJECT_RENDERING_LAYERS: number = 16; // number of layers to render objects on. e.g. for a value of 16, 0 is the lowest layer, 15 is the highest

  /**
   * Keep an eye on this and any getters, don't run it on hot code paths
   */
  static get CANVAS_HEIGHT(): number {
    return CanvasConstants.TILE_SIZE * CanvasConstants.CANVAS_TILE_HEIGHT;
  }

  static get CANVAS_WIDTH(): number {
    return CanvasConstants.TILE_SIZE * CanvasConstants.CANVAS_TILE_WIDTH;
  }

  static get CANVAS_CENTER_TILE_Y(): number {
    return Math.floor(this.CANVAS_TILE_HEIGHT / 2);
  }

  static get CANVAS_CENTER_TILE_X(): number {
    return Math.floor(this.CANVAS_TILE_WIDTH / 2);
  }

  static get ASPECT_RATIO(): number {
    return CanvasConstants.CANVAS_TILE_HEIGHT / CanvasConstants.CANVAS_TILE_WIDTH;
  }
}
