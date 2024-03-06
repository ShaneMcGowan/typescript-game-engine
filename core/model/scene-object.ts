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

const DEFAULT_WIDTH: number = 1;
const DEFAULT_HEIGHT: number = 1;

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
  width: number;
  height: number;

  // TODO(smg): Currently we are using positionX and positionY as the top left corner of the object
  // boundingX and boundingY are the bottom right corner of the object
  // I want to change this so that positionX and positionY are the center of the object (or whatever the user wants it to be)
  // I at least want it to be configurable.
  // boundingBox should then be used for all collisions and be based off of positionX and positionY and width and height
  // e.g. positionX = 5 and position Y = 10, width and height = 2 would mean the bounding box is
  // top: 9, (10 - (2 / 2) = 9)
  // right: 6, (5 + (2 / 2) = 6)
  // bottom: 11, (10 + (2 / 2) = 11
  // left: 4 (5 - (2 / 2) = 4

  // TODO(smg): this being a getter probably is quite slow if it's used a lot but it's fine for now
  get boundingBox(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    let xOffset = this.width / 2; // TODO(smg): this should be calculated based off of how the user wants the position to be calculated
    let yOffset = this.height / 2; // TODO(smg): same as above

    return {
      top: this.positionY - yOffset,
      right: this.positionX + xOffset,
      bottom: this.positionY + yOffset,
      left: this.positionX - xOffset,
    };
  }

  // collision
  hasCollision: boolean;
  collisionLayer: number;

  // rendering
  renderCanvas: HTMLCanvasElement;
  renderContext: CanvasRenderingContext2D;
  isRenderable: boolean;
  renderLayer: number;
  renderOpacity: number; // the opacity of the object when rendered (value between 0 and 1)
  renderScale: number; // the scale of the object when rendered

  // TODO(smg): I'm not convinced of this but I will go with it for now
  keyListeners: Record<string, (event: KeyboardEvent) => void> = {}; // for keyboard events
  eventListeners: Record<string, (event: CustomEvent) => void> = {}; // for scene events

  protected mainContext: CanvasRenderingContext2D;
  protected assets: Assets;

  // flags
  flaggedForRender: boolean = true; // TODO(smg): implement the usage of this flag to improve engine performance
  flaggedForUpdate: boolean = true; // TODO(smg): implement the usage of this flag to improve engine performance
  flaggedForDestroy: boolean = false; // TODO(smg): implement this. used to remove object from scene on next update rather than mid update etc

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

    this.width = config.width ?? DEFAULT_WIDTH;
    this.height = config.height ?? DEFAULT_HEIGHT;

    this.isRenderable = config.isRenderable ?? DEFAULT_IS_RENDERABLE;
    this.renderLayer = config.renderLayer ?? DEFAULT_RENDER_LAYER;
    this.renderOpacity = config.renderOpacity ?? DEFAULT_RENDER_OPACITY;

    this.hasCollision = config.hasCollision ?? DEFAULT_HAS_COLLISION;
    this.collisionLayer = config.collisionLayer ?? DEFAULT_COLLISION_LAYER;
    this.renderScale = config.renderScale ?? DEFAULT_RENDER_SCALE;

    console.table({
      id: this.id,
      width: this.width * CanvasConstants.TILE_SIZE,
      height: this.height * CanvasConstants.TILE_SIZE,
    });

    this.renderCanvas = RenderUtils.createCanvas(this.width, this.height);
    this.renderContext = RenderUtils.getContext(this.renderCanvas);
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
      Math.floor(this.positionX * CanvasConstants.TILE_SIZE),
      Math.floor(this.positionY * CanvasConstants.TILE_SIZE),
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
      this.positionX,
      this.positionY,
      Math.floor(this.width * CanvasConstants.TILE_SIZE),
      Math.floor(this.height * CanvasConstants.TILE_SIZE),
      { colour: 'red', }
    );
  }

  /**
   * Used for debugging
   * @param context
   */
  // TODO(smg): duplicate of debuggerRenderBackground but using boundingBox
  debuggerRenderBackground2(context: CanvasRenderingContext2D): void {
    let box = this.boundingBox;
    RenderUtils.fillRectangle(
      context,
      box.left,
      box.top,
      Math.floor(this.width * CanvasConstants.TILE_SIZE),
      Math.floor(this.height * CanvasConstants.TILE_SIZE),
      { colour: 'blue', }
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

  get boundingX(): number {
    return this.positionX + this.width;
  }

  get boundingY(): number {
    return this.positionY + this.height;
  }

  isCollidingWith(object: SceneObject): boolean {
    return this.isWithinHorizontalBounds(object) && this.isWithinVerticalBounds(object);
  }

  isWithinHorizontalBounds(object: SceneObject): boolean {
    if (object.positionX >= this.positionX && object.positionX <= this.boundingX) {
      return true;
    }

    if (object.boundingX >= this.positionX && object.boundingX <= this.boundingX) {
      return true;
    }

    return false;
  }

  isWithinVerticalBounds(object: SceneObject): boolean {
    if (object.positionY >= this.positionY && object.positionY <= this.boundingY) {
      return true;
    }

    if (object.boundingY >= this.positionY && object.boundingY <= this.boundingY) {
      return true;
    }

    return false;
  }
}
