export abstract class CanvasConstants {
  static CANVAS_TILE_HEIGHT = 18; // total height in tiles
  static CANVAS_TILE_WIDTH = 32; // total width in tiles
  static TILE_SIZE: number = 16; // e.g. 32 means a pixel size of tile (32px x 32px)
  static OBJECT_RENDERING_LAYERS: number = 16; // number of layers to render objects on. e.g. for a value of 16, 0 is the lowest layer, 15 is the highest
  static UI_RENDERING_LAYERS: number = 16; // number of layers to render ui on e.g. for a value of 16, these are after the OBJECT_RENDERING_LAYERS, so the first index is after those
  static OBJECT_COLLISION_LAYERS: number = 16; // number of layers on which objects can collide. e.g. for a value of 16, 0 is the lowest layer, 15 is the highest
  static CONTEXT_IMAGE_SMOOTHING_ENABLED: boolean = false; // whether to enable image smoothing on the canvas context

  /**
   * Keep an eye on this and any getters, don't run it on hot code paths
   */
  static get CANVAS_HEIGHT(): number {
    return CanvasConstants.TILE_SIZE * CanvasConstants.CANVAS_TILE_HEIGHT;
  }

  static get CANVAS_WIDTH(): number {
    return CanvasConstants.TILE_SIZE * CanvasConstants.CANVAS_TILE_WIDTH;
  }

  static get ASPECT_RATIO(): number {
    return CanvasConstants.CANVAS_TILE_HEIGHT / CanvasConstants.CANVAS_TILE_WIDTH;
  }

  static get TOTAL_RENDERING_LAYERS(): number {
    return CanvasConstants.OBJECT_RENDERING_LAYERS + CanvasConstants.UI_RENDERING_LAYERS;
  }

  /**
   * The first layer that UI elements should be rendered on
   */
  static get FIRST_UI_RENDER_LAYER(): number {
    return CanvasConstants.OBJECT_RENDERING_LAYERS;
  }

  /**
   * The last layer that UI elements should be rendered on
   */
  static get LAST_UI_RENDER_LAYER(): number {
    return CanvasConstants.OBJECT_RENDERING_LAYERS + CanvasConstants.UI_RENDERING_LAYERS - 1;
  }

  /**
   * The collision layer for UI elements so that game elements don't interact with them
   */
  static get UI_COLLISION_LAYER(): number {
    return CanvasConstants.OBJECT_COLLISION_LAYERS - 1;
  }

  static get CANVAS_CENTER_TILE_Y(): number {
    return this.CANVAS_TILE_HEIGHT / 2;
  }

  static get CANVAS_CENTER_TILE_X(): number {
    return this.CANVAS_TILE_WIDTH / 2;
  }

  static get CANVAS_CENTER_PIXEL_X(): number {
    return CanvasConstants.CANVAS_WIDTH / 2;
  }

  static get CANVAS_CENTER_PIXEL_Y(): number {
    return CanvasConstants.CANVAS_HEIGHT / 2;
  }
}
