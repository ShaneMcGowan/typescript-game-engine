import { RenderUtils } from '@core/utils/render.utils';
import { type Scene } from './scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { Vector } from './vector';
import { type Coordinate } from './coordinate';

export interface SceneObjectBoundingBox {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

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
  save: boolean; // used to check if an object should be saved
}

export interface SceneObjectBaseConfig {
  x?: number;
  y?: number;

  width?: number;
  height?: number;

  renderEnabled?: boolean;
  renderLayer?: number;
  renderOpacity?: number;
  renderScale?: number;

  collisionEnabled?: boolean;
  collisionLayer?: number;

  onAwake?: () => void;
  onUpdate?: (delta: number) => void;
  onRender?: (context: CanvasRenderingContext2D) => void;
  onDestroy?: () => void;
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
const FLAGS_SAVE_DEFAULT: boolean = false;

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

  // callbacks
  onAwake?(): void; // called once at start of frame if awakeRan is false
  onUpdate?(delta: number): void; // called every frame after awake
  onRender?(context: CanvasRenderingContext2D): void; // called every frame after update
  onDestroy?(): void; // called once after render if flags.destroy is true

  fromJson?(json: string): void; // used to populate a SceneObject with state from JSON
  toJson?(): string; // used to convert the state of a SceneIbject to JSON

  protected mainContext: CanvasRenderingContext2D;

  readonly children: Map<string, SceneObject> = new Map<string, SceneObject>();
  parent: SceneObject | undefined = undefined;

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
      save: FLAGS_SAVE_DEFAULT,
    };

    this.transform.position.local.x = config.x ?? this.transform.position.local.x;
    this.transform.position.local.y = config.y ?? this.transform.position.local.y;

    this.collision.enabled = config.collisionEnabled ?? COLLISION_ENABLED_DEFAULT;
    this.collision.layer = config.collisionLayer ?? COLLISION_LAYER_DEFAULT;

    this.renderer.enabled = config.renderEnabled ?? this.renderer.enabled;
    this.renderer.layer = config.renderLayer ?? this.renderer.layer;
    this.renderer.opacity = config.renderOpacity ?? this.renderer.opacity;
    this.renderer.scale = config.renderScale ?? this.renderer.scale;

    this.width = config.width ?? this.width;
    this.height = config.height ?? this.height;

    if (config.onAwake !== undefined) {
      this.onAwake = config.onAwake;
    };
    if (config.onUpdate !== undefined) {
      this.onUpdate = config.onUpdate;
    };
    if (config.onRender !== undefined) {
      this.onRender = config.onRender;
    };
    if (config.onDestroy !== undefined) {
      this.onDestroy = config.onDestroy;
    };
  }

  awake(): void {
    if (this.flags.awake) {
      return;
    }

    // set flag to true as awake has been ran and should only ever be ran once
    this.flags.awake = true;

    if (this.onAwake === undefined) {
      return;
    }

    this.onAwake();
  }

  update(delta: number): void {
    if (!this.flags.update) {
      return;
    }

    if (this.onUpdate === undefined) {
      return;
    }

    this.onUpdate(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    if (!this.renderer.enabled) {
      return;
    }

    if (!this.flags.render) {
      return;
    }

    if (this.onRender === undefined) {
      return;
    }

    this.onRender(context);
  }

  /**
   * Flags this object for destruction this frame. The object will be destroyed after the update loop ends.
   */
  destroy(): void {
    this.flags.destroy = true;
    // this.flags.update = true; TODO: should update be disabled for SceneObjects that are marked for deletion?

    // flag children for destroy
    this.children.forEach(child => { child.destroy(); });
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

  get centre(): {
    local: Coordinate;
    world: Coordinate;
  } {
    return {
      local: {
        x: this.transform.position.local.x + (this.width / 2),
        y: this.transform.position.local.y + (this.height / 2),
      },
      world: {
        x: this.transform.position.world.x + (this.width / 2),
        y: this.transform.position.world.y + (this.height / 2),
      },
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
    if (this.isCollidingWithHorizontally(object) && this.isCollidingWithVertically(object)) {
      return true;
    }

    return false;
  }

  isCollidingWithHorizontally(object: SceneObject): boolean {
    if (
      this.boundingBox.world.left < object.boundingBox.world.right &&
      this.boundingBox.world.right > object.boundingBox.world.left
    ) {
      return true;
    }

    return false;
  }

  isCollidingWithVertically(object: SceneObject): boolean {
    if (
      this.boundingBox.world.top < object.boundingBox.world.bottom &&
      this.boundingBox.world.bottom > object.boundingBox.world.top
    ) {
      return true;
    }

    return false;
  }

  static calculateBoundingBox(x: number, y: number, width: number, height: number): SceneObjectBoundingBox {
    return {
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
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
    object.destroy();
  }

  removeAllChildren(): void {
    this.children.forEach(child => { this.removeChild(child); });
  }

  get rootParent(): SceneObject {
    return getRootParent(this);
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

  /**
   * calculate the offset from position.world that will center a sprite
   * @param spriteWidth
   * @param spriteHeight
   * @returns
   */
  protected calculateSpriteOffset(spriteWidth: number, spriteHeight: number): { x: number; y: number; } {
    return {
      x: (this.width / 2) - (spriteWidth / 2),
      y: (this.height / 2) - (spriteHeight / 2),
    };
  }
}

function getRootParent(object: SceneObject): SceneObject {
  if (object.parent === undefined) {
    return object;
  }

  return getRootParent(object.parent);
}
