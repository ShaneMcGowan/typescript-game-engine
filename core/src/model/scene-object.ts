import { RenderUtils } from '@core/utils/render.utils';
import { type Scene } from './scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
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
  layer: number; // used to decide whether objects will collide with each other
}

interface Renderer {
  enabled: boolean;
  layer: number;
  opacity: number; // the opacity of the object when rendered (value between 0 and 1)
  scale: number; // the scale of the object when rendered
}

interface Flags {
  awake: boolean; // flag to check if awake has been run for this object yet
  update: boolean; // flag to check if update should be ran for the object this frame, TODO: implement the usage of this flag to improve engine performance
  render: boolean; // flag to check if render should be ran for the object this frame, TODO: implement the usage of this flag to improve engine performance
  destroy: boolean; // used to remove object from scene during the "destroyObjects" segment of the frame. This is to avoid modifying the scene while iterating over it
}

export interface SceneObjectBaseConfig {
  positionX?: number;
  positionY?: number;

  width?: number;
  height?: number;

  renderEnabled?: boolean;
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

const FLAGS_AWAKE_DEFAULT: boolean = false;
const FLAGS_UPDATE_DEFAULT: boolean = true;
const FLAGS_RENDER_DEFAULT: boolean = true;
const FLAGS_DESTROY_DEFAULT: boolean = false;

const WIDTH_DEFAULT: number = 1;
const HEIGHT_DEFAULT: number = 1;

export abstract class SceneObject {
  readonly id: string = crypto.randomUUID();

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

  // dimensions
  width: number = WIDTH_DEFAULT;
  height: number = HEIGHT_DEFAULT;

  protected mainContext: CanvasRenderingContext2D;

  children = new Array<SceneObject>(); // TODO: begin parent / child objects
  parent: SceneObject | undefined = undefined; // TODO: begin parent / child objects

  constructor(
    protected scene: Scene,
    config: SceneObjectBaseConfig
  ) {
    this.mainContext = this.scene.renderContext;

    this.transform.position.x = config.positionX ?? this.transform.position.x;
    this.transform.position.y = config.positionY ?? this.transform.position.y;

    this.collision.enabled = config.collisionEnabled ?? COLLISION_ENABLED_DEFAULT;
    this.collision.layer = config.collisionLayer ?? COLLISION_LAYER_DEFAULT;

    this.renderer.enabled = config.renderEnabled ?? this.renderer.enabled;
    this.renderer.layer = config.renderLayer ?? this.renderer.layer;
    this.renderer.opacity = config.renderOpacity ?? this.renderer.opacity;
    this.renderer.scale = config.renderScale ?? this.renderer.scale;

    this.width = config.width ?? this.width;
    this.height = config.height ?? this.height;
  }

  awake?(): void; // called once at start of frame if awakeRan is false
  update?(delta: number): void; // called every frame after awake
  render?(context: CanvasRenderingContext2D): void; // called every frame after update
  destroy?(): void; // called once after render if flaggedForDestroy is true

  get boundingBox(): SceneObjectBoundingBox {
    return SceneObject.calculateBoundingBox(
      this.transform.position.x,
      this.transform.position.y,
      this.width,
      this.height
    );
  }

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
