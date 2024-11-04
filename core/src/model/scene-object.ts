import { RenderUtils } from '@core/utils/render.utils';
import { type Scene } from './scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Assets } from './assets';
import { Vector } from './vector';

export interface SceneObjectBoundingBox {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Transform {
  position: Vector;
  scale: number;
  rotation: number;
}

interface Collision {
  enabled: boolean;
  layer: number;
}

export interface SceneObjectBaseConfig {
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;

  isRenderable?: boolean;
  renderLayer?: number;
  renderOpacity?: number;
  renderScale?: number;

  collisionEnabled?: boolean;
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

  readonly transform: Transform = {
    position: new Vector(0, 0),
    scale: 1,
    rotation: 1
  }

  readonly collision: Collision = {
    enabled: false,
    layer: DEFAULT_COLLISION_LAYER
  }

  get positionX(): number {
    return this.transform.position.x;
  }

  get positionY(): number {
    return this.transform.position.y;
  }

  get boundingBox(): SceneObjectBoundingBox {
    return SceneObject.calculateBoundingBox(
      this.transform.position.x,
      this.transform.position.y,
      this.width,
      this.height
    )
  }
  // dimensions
  width: number = 1;
  height: number = 1;

  // rendering
  isRenderable: boolean;
  renderLayer: number;
  renderOpacity: number; // the opacity of the object when rendered (value between 0 and 1)
  renderScale: number; // the scale of the object when rendered

  protected mainContext: CanvasRenderingContext2D;
  protected assets: Assets; // TODO: this shouldn't be on the object, leave it on the scene

  // flags
  flaggedForRender: boolean = true; // TODO: implement the usage of this flag to improve engine performance
  flaggedForUpdate: boolean = true; // TODO: implement the usage of this flag to improve engine performance
  flaggedForDestroy: boolean = false; // used to remove object from scene during the "destroyObjects" segment of the frame. This is to avoid modifying the scene while iterating over it

  children: Array<SceneObject> = new Array(); // TODO: begin parent / child objects
  parent: SceneObject | undefined = undefined; // TODO: begin parent / child objects

  awakeRan: boolean = false; // flag to check if awake has been run for this object yet

  constructor(
    protected scene: Scene,
    config: SceneObjectBaseConfig
  ) {
    this.mainContext = this.scene.context;
    this.assets = this.scene.assets;

    // position default
    if (config.positionX !== undefined) {
      this.transform.position.x = config.positionX
    }

    if (config.positionY !== undefined) {
      this.transform.position.y = config.positionY;
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

    this.collision.enabled = config.collisionEnabled ?? DEFAULT_HAS_COLLISION;
    this.collision.layer = config.collisionLayer ?? DEFAULT_COLLISION_LAYER;
    this.renderScale = config.renderScale ?? DEFAULT_RENDER_SCALE;
  }

  awake?(): void; // TODO: when is this called? IMPLEMENT THIS
  update?(delta: number): void; // called every frame
  render?(context: CanvasRenderingContext2D): void; // called every frame after update
  destroy?(): void; // TODO: when is this called?

  /**
   * Used for debugging
   * @param context
   */
  debuggerRenderBoundary(context: CanvasRenderingContext2D): void {
    RenderUtils.strokeRectangle(
      context,
      this.boundingBox.left,
      this.boundingBox.top,
      this.width,
      this.height,
      {
        colour: 'red',
        type: 'tile'
      }
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
    return this.transform.position.x + this.scene.globals.camera.startX;
  }

  get cameraRelativePositionY(): number {
    return this.transform.position.y + this.scene.globals.camera.startY;
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

  static calculateBoundingBox(x: number, y: number, width: number, height: number): SceneObjectBoundingBox {
    let xOffset = width / 2;
    let yOffset = height / 2;

    return {
      top: y - yOffset,
      right: x + xOffset,
      bottom: y + yOffset,
      left: x - xOffset,
    };
  }
}
