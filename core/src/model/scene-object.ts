import { RenderUtils } from '@core/utils/render.utils';
import { type Scene } from './scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Assets } from './assets';

export interface SceneObjectBaseConfig {
  positionX?: number;
  positionY?: number;
  targetX?: number;
  targetY?: number;
  width?: number;
  height?: number;

  isRenderable?: boolean;
  renderLayer?: number;
  renderOpacity?: number;
  renderScale?: number;

  hasCollision?: boolean;
  collisionLayer?: number;
}

const DEFAULT_IS_RENDERABLE: boolean = false;
const DEFAULT_RENDER_LAYER: number = 0;
const DEFAULT_RENDER_OPACITY: number = 1;
const DEFAULT_RENDER_SCALE: number = 1;

const DEFAULT_HAS_COLLISION: boolean = false;
const DEFAULT_COLLISION_LAYER: number = 0;

export abstract class SceneObject {
  id: string = crypto.randomUUID();

  // position
  positionX: number = -1;
  positionY: number = -1;
  targetX: number = -1;
  targetY: number = -1;

  // dimensions
  width: number = 1;
  height: number = 1;

  // collision
  hasCollision: boolean;
  collisionLayer: number;

  // rendering
  isRenderable: boolean;
  renderLayer: number;
  renderOpacity: number; // the opacity of the object when rendered (value between 0 and 1)
  renderScale: number; // the scale of the object when rendered

  // TODO: I'm not convinced of this but I will go with it for now
  keyListeners: Record<string, (event: KeyboardEvent) => void> = {}; // for keyboard events
  eventListeners: Record<string, (event: CustomEvent) => void> = {}; // for scene events

  protected mainContext: CanvasRenderingContext2D;
  protected assets: Assets;

  // flags
  flaggedForRender: boolean = true; // TODO: implement the usage of this flag to improve engine performance
  flaggedForUpdate: boolean = true; // TODO: implement the usage of this flag to improve engine performance
  flaggedForDestroy: boolean = false; // used to remove object from scene during the "destroyObjects" segment of the frame. This is to avoid modifying the scene while iterating over it

  // TODO: Currently we are using positionX and positionY as the top left corner of the object
  // boundingX and boundingY are the bottom right corner of the object
  // I want to change this so that positionX and positionY are the center of the object (or whatever the user wants it to be)
  // I at least want it to be configurable.
  // boundingBox should then be used for all collisions and be based off of positionX and positionY and width and height
  // e.g. positionX = 5 and position Y = 10, width and height = 2 would mean the bounding box is
  // top: 9, (10 - (2 / 2) = 9)
  // right: 6, (5 + (2 / 2) = 6)
  // bottom: 11, (10 + (2 / 2) = 11
  // left: 4 (5 - (2 / 2) = 4

  // TODO: this being a getter probably is quite slow if it's used a lot but it's fine for now
  get boundingBox(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    let xOffset = this.width / 2; // TODO: this should be calculated based off of how the user wants the position to be calculated
    let yOffset = this.height / 2; // TODO: same as above

    return {
      top: this.positionY - yOffset,
      right: this.positionX + xOffset,
      bottom: this.positionY + yOffset,
      left: this.positionX - xOffset,
    };
  }

  constructor(
    protected scene: Scene,
    config: SceneObjectBaseConfig
  ) {
    this.mainContext = this.scene.context;
    this.assets = this.scene.assets;

    // position default
    if (config.positionX !== undefined) {
      this.positionX = config.positionX;
      if (config.targetX === undefined) {
        this.targetX = this.positionX;
      }
    }

    if (config.positionY !== undefined) {
      this.positionY = config.positionY;
      if (config.targetY === undefined) {
        this.targetY = this.positionY;
      }
    }

    if (config.targetX !== undefined) {
      this.targetX = config.targetX;
    }

    if (config.targetY !== undefined) {
      this.targetY = config.targetY;
    }

    if (config.width !== undefined) {
      this.width = config.width;
    }

    if (config.height !== undefined) {
      this.height = config.height;
    }

    this.isRenderable = config.isRenderable ?? DEFAULT_IS_RENDERABLE;
    this.renderLayer = config.renderLayer ?? DEFAULT_RENDER_LAYER;
    this.renderOpacity = config.renderOpacity ?? DEFAULT_RENDER_OPACITY;

    this.hasCollision = config.hasCollision ?? DEFAULT_HAS_COLLISION;
    this.collisionLayer = config.collisionLayer ?? DEFAULT_COLLISION_LAYER;
    this.renderScale = config.renderScale ?? DEFAULT_RENDER_SCALE;
  }

  update?(delta: number): void;
  render?(context: CanvasRenderingContext2D): void;
  destroy?(): void;

  /**
   * Used for debugging
   * @param context
   */
  debuggerRenderBoundary(context: CanvasRenderingContext2D): void {
    RenderUtils.strokeRectangle(
      context,
      Math.floor(this.boundingBox.left * CanvasConstants.TILE_SIZE),
      Math.floor(this.boundingBox.top * CanvasConstants.TILE_SIZE),
      Math.floor(this.width * CanvasConstants.TILE_SIZE),
      Math.floor(this.height * CanvasConstants.TILE_SIZE),
      'red'
    );
  }

  /**
   * Used for debugging
   * @param context
   */
  debuggerRenderBackground(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.boundingBox.left,
      this.boundingBox.top,
      Math.floor(this.width * CanvasConstants.TILE_SIZE),
      Math.floor(this.height * CanvasConstants.TILE_SIZE),
      { colour: 'red', }
    );
  }

  get cameraRelativePositionX(): number {
    return this.positionX + this.scene.globals.camera.startX;
  }

  get cameraRelativePositionY(): number {
    return this.positionY + this.scene.globals.camera.startY;
  }

  get pixelWidth(): number {
    return this.width * CanvasConstants.TILE_SIZE;
  }

  get pixelHeight(): number {
    return this.height * CanvasConstants.TILE_SIZE;
  }

  isCollidingWith(object: SceneObject): boolean {
    return this.isWithinHorizontalBounds(object) && this.isWithinVerticalBounds(object);
  }

  isWithinHorizontalBounds(object: SceneObject): boolean {
    if (object.boundingBox.left >= this.boundingBox.left && object.boundingBox.left <= this.boundingBox.right) {
      return true;
    }

    if (object.boundingBox.right >= this.boundingBox.left && object.boundingBox.right <= this.boundingBox.right) {
      return true;
    }

    return false;
  }

  isWithinVerticalBounds(object: SceneObject): boolean {
    if (object.boundingBox.top >= this.boundingBox.top && object.boundingBox.top <= this.boundingBox.bottom) {
      return true;
    }

    if (object.boundingBox.bottom >= this.boundingBox.top && object.boundingBox.bottom <= this.boundingBox.bottom) {
      return true;
    }

    return false;
  }
}
