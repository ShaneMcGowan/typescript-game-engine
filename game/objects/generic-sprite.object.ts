import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';

const DEFAULT_DESTROYED_AT_TARGET: boolean = false;
const DEFAULT_MOVEMENT_SPEED: number = 0.5;
const DEFAULT_CAN_MOVE: boolean = false;

interface Config extends SceneObjectBaseConfig {
  tileset: string;
  spriteX: number;
  spriteY: number;
  spriteWidth?: number;
  spriteHeight?: number;
  destroyAtTarget?: boolean; // destroy the object when it reaches its target position
  canMove?: boolean;
  movementSpeed?: number;
  targetX?: number;
  targetY?: number;
}

/**
 * A generic sprite object that can be used to render a sprite from a tileset.
 */
export class GenericSpriteObject extends SceneObject {
  targetX: number = -1;
  targetY: number = -1;

  tileset: string;
  spriteX: number;
  spriteY: number;
  spriteWidth: number;
  spriteHeight: number;
  destroyAtTarget: boolean;

  movementSpeed: number = DEFAULT_MOVEMENT_SPEED;
  canMove: boolean;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;

    this.tileset = config.tileset;
    this.spriteX = config.spriteX;
    this.spriteY = config.spriteY;
    this.spriteHeight = config.spriteHeight;
    this.spriteWidth = config.spriteWidth;
    this.destroyAtTarget = config.destroyAtTarget ?? DEFAULT_DESTROYED_AT_TARGET;
    this.movementSpeed = config.movementSpeed ?? DEFAULT_MOVEMENT_SPEED;
    this.canMove = config.canMove ?? DEFAULT_CAN_MOVE;
    this.targetX = config.targetX ?? this.targetX;
    this.targetY = config.targetY ?? this.targetY;
  }

  onUpdate(delta: number): void {
    this.updatePosition(delta);
  }

  private updatePosition(delta: number): void {
    if (!this.canMove) {
      return;
    }

    if (this.transform.position.local.x === this.targetX && this.transform.position.local.y === this.targetY) {
      if (this.destroyAtTarget) {
        this.destroy();
      }
      return;
    }

    const velocity = this.movementSpeed * delta;
    const coordinates = MovementUtils.MoveTowardsPosition(
      {
        x: this.transform.position.local.x,
        y: this.transform.position.local.y,
      },
      {
        x: this.targetX,
        y: this.targetY,
      },
      velocity
    );

    this.transform.position.local.x = coordinates.x;
    this.transform.position.local.y = coordinates.y;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.tileset],
      this.spriteX,
      this.spriteY,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.spriteWidth,
      this.spriteWidth,
      {
        centered: true,
      }
    );
  }
}
