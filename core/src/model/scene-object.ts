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

// TODO:
//  in order to enable child and parent objects, position needs to be updated
//  for now we will place worldPosition on the `transform` object
//  but later we will want to update transform to be
//  {
//    position: {
//      readonly local: Vector
//      readonly world: Vector
//    }
//  }
interface Transform {
  readonly position: {
    readonly local: Vector;
    readonly world: Vector;
  };
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
  readonly transform: Transform;
  readonly collision: Collision;
  readonly renderer: Renderer;
  readonly flags: Flags;

  // dimensions
  width: number = WIDTH_DEFAULT;
  height: number = HEIGHT_DEFAULT;

  protected mainContext: CanvasRenderingContext2D;

  readonly children: Map<string, SceneObject> = new Map<string, SceneObject>();
  parent: SceneObject | undefined = undefined; // TODO: begin parent / child objects

  constructor(
    protected scene: Scene,
    config: SceneObjectBaseConfig
  ) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    this.mainContext = this.scene.renderContext;

    this.transform = {
      position: {
        local: TRANSFORM_POSITION_DEFAULT(),
        get world() {
          return _this.calculateWorldPosition();
        },
      },
      scale: TRANSFORM_SCALE_DEFAULT,
      rotation: TRANSFORM_ROTATION_DEFAULT,
    };

    this.collision = {
      enabled: COLLISION_ENABLED_DEFAULT,
      layer: COLLISION_LAYER_DEFAULT,
    };

    this.renderer = {
      enabled: RENDERER_ENABLED_DEFAULT,
      layer: RENDERER_LAYER_DEFAULT,
      opacity: RENDERER_OPACITY_DEFAULT,
      scale: RENDERER_SCALE_DEFAULT,
    };

    this.flags = {
      awake: FLAGS_AWAKE_DEFAULT,
      update: FLAGS_UPDATE_DEFAULT,
      render: FLAGS_RENDER_DEFAULT,
      destroy: FLAGS_DESTROY_DEFAULT,
    };

    this.transform.position.local.x = config.positionX ?? this.transform.position.local.x;
    this.transform.position.local.y = config.positionY ?? this.transform.position.local.y;

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
  destroy?(): void; // called once after render if flags.destroy is true
  flagForDestroy(): void {
    this.flags.destroy = true;

    // flag children for destroy
    this.children.forEach(child => { child.flagForDestroy(); });
  }

  get boundingBox(): {
    local: SceneObjectBoundingBox;
    world: SceneObjectBoundingBox;
  } {
    return {
      local: SceneObject.calculateBoundingBox(
        this.transform.position.local.x,
        this.transform.position.local.y,
        this.width,
        this.height
      ),
      world: SceneObject.calculateBoundingBox(
        this.transform.position.world.x,
        this.transform.position.world.y,
        this.width,
        this.height
      ),
    };
  }

  /**
   * Used for debugging
   * @param context
   */
  debuggerRenderBoundary(context: CanvasRenderingContext2D): void {
    RenderUtils.strokeRectangle(
      context,
      this.boundingBox.world.left,
      this.boundingBox.world.top,
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
      this.boundingBox.world.left,
      this.boundingBox.world.top,
      Math.floor(this.width * CanvasConstants.TILE_SIZE),
      Math.floor(this.height * CanvasConstants.TILE_SIZE),
      { colour: 'red', }
    );
  }

  isCollidingWith(object: SceneObject): boolean {
    return this.isWithinHorizontalBounds(object) && this.isWithinVerticalBounds(object);
  }

  isWithinHorizontalBounds(object: SceneObject): boolean {
    if (object.boundingBox.world.left >= this.boundingBox.world.left && object.boundingBox.world.left <= this.boundingBox.world.right) {
      return true;
    }

    if (object.boundingBox.world.right >= this.boundingBox.world.left && object.boundingBox.world.right <= this.boundingBox.world.right) {
      return true;
    }

    return false;
  }

  isWithinVerticalBounds(object: SceneObject): boolean {
    if (object.boundingBox.world.top >= this.boundingBox.world.top && object.boundingBox.world.top <= this.boundingBox.world.bottom) {
      return true;
    }

    if (object.boundingBox.world.bottom >= this.boundingBox.world.top && object.boundingBox.world.bottom <= this.boundingBox.world.bottom) {
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

  addChild(object: SceneObject): void {
    this.children.set(object.id, object);
    object.parent = this;
    this.scene.addObject(object);
  }

  removeChild(object: SceneObject): void {
    // ensure provided object is a child of this object
    if (this.children.get(object.id) === undefined) {
      return;
    }

    // references will be cleaned up as part of destroy so no need to do anything more here
    object.flagForDestroy();
  }

  removeAllChildren(): void {
    this.children.forEach(child => { this.removeChild(child); });
  }

  /**
   * calculate world position based on local position and parent's position
   * @returns Vector
   */
  calculateWorldPosition(): Vector {
    if (this.parent === undefined) {
      return new Vector(
        this.transform.position.local.x,
        this.transform.position.local.y
      );
    }

    return new Vector(
      this.transform.position.local.x + this.parent.transform.position.world.x,
      this.transform.position.local.y + this.parent.transform.position.world.y
    );
  }
}
