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
  rotation: number; // rotation in degrees
}

interface Collision {
  enabled: boolean;
  layer: number;
}

interface Renderer {
  enabled: boolean;
  layer: number;
  opacity: number; // the opacity of the object when rendered (value between 0 and 1)
  scale: number; // the scale of the object when rendered
}

interface Flags {
  awake: boolean; // flag to check if awake has been run for this object yet
  update: boolean; // TODO: implement the usage of this flag to improve engine performance
  render: boolean; // TODO: implement the usage of this flag to improve engine performance
  destroy: boolean; // used to remove object from scene during the "destroyObjects" segment of the frame. This is to avoid modifying the scene while iterating over it
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

const TRANSFORM_POSITION_DEFAULT = (): Vector => new Vector(0, 0);
const TRANSFORM_SCALE_DEFAULT = 1;
const TRANSFORM_ROTATION_DEFAULT = 0;

const COLLISION_ENABLED_DEFAULT: boolean = false;
const COLLISION_LAYER_DEFAULT: number = 0;

const RENDERER_ENABLED_DEFAULT: boolean = false;
const RENDERER_LAYER_DEFAULT: number = 0;
const RENDERER_OPACITY_DEFAULT: number = 1;
const RENDERER_SCALE_DEFAULT: number = 1;

const FLAGS_AWAKE_DEFAULT = false;
const FLAGS_UPDATE_DEFAULT = false;
const FLAGS_RENDER_DEFAULT = false;
const FLAGS_DESTROY_DEFAULT = false;

export abstract class SceneObject {
  id: string = crypto.randomUUID();

  readonly transform: Transform = {
    position: TRANSFORM_POSITION_DEFAULT(),
    scale: TRANSFORM_SCALE_DEFAULT,
    rotation: TRANSFORM_ROTATION_DEFAULT,
  };

  readonly collision: Collision = {
    enabled: COLLISION_ENABLED_DEFAULT,
    layer: COLLISION_LAYER_DEFAULT,
  };

  readonly renderer: Renderer = {
    enabled: RENDERER_ENABLED_DEFAULT,
    layer: RENDERER_LAYER_DEFAULT,
    opacity: RENDERER_OPACITY_DEFAULT,
    scale: RENDERER_SCALE_DEFAULT,
  };

  readonly flags: Flags = {
    awake: FLAGS_AWAKE_DEFAULT,
    update: FLAGS_UPDATE_DEFAULT,
    render: FLAGS_RENDER_DEFAULT,
    destroy: FLAGS_DESTROY_DEFAULT,
  };

  get boundingBox(): SceneObjectBoundingBox {
    return SceneObject.calculateBoundingBox(
      this.transform.position.x,
      this.transform.position.y,
      this.width,
      this.height
    );
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
  flaggedForUpdate: boolean = true; // TODO: implement the usage of this flag to improve engine performance
  flaggedForRender: boolean = true; // TODO: implement the usage of this flag to improve engine performance
  flaggedForDestroy: boolean = false; // used to remove object from scene during the "destroyObjects" segment of the frame. This is to avoid modifying the scene while iterating over it

  children = new Array<SceneObject>(); // TODO: begin parent / child objects
  parent: SceneObject | undefined = undefined; // TODO: begin parent / child objects

  constructor(
    protected scene: Scene,
    config: SceneObjectBaseConfig
  ) {
    this.mainContext = this.scene.context;
    this.assets = this.scene.assets;

    // position default
    if (config.positionX !== undefined) {
      this.transform.position.x = config.positionX;
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

    this.isRenderable = config.isRenderable ?? RENDERER_ENABLED_DEFAULT;
    this.renderLayer = config.renderLayer ?? RENDERER_LAYER_DEFAULT;
    this.renderOpacity = config.renderOpacity ?? RENDERER_OPACITY_DEFAULT;

    this.collision.enabled = config.collisionEnabled ?? COLLISION_ENABLED_DEFAULT;
    this.collision.layer = config.collisionLayer ?? COLLISION_LAYER_DEFAULT;
    this.renderScale = config.renderScale ?? RENDERER_SCALE_DEFAULT;
  }

  awake?(): void; // called once at start of frame if awakeRan is false
  update?(delta: number): void; // called every frame after awake
  render?(context: CanvasRenderingContext2D): void; // called every frame after update
  destroy?(): void; // called once after render if flaggedForDestroy is true

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
        type: 'tile',
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
