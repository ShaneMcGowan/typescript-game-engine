import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';

const DEFAULT_DESTROYED_AT_TARGET = false;
const DEFAULT_MOVEMENT_SPEED = 0.5;

interface Config extends SceneObjectBaseConfig {
  tileset: string;
  spriteX: number;
  spriteY: number;
  spriteWidth?: number;
  spriteHeight?: number;
  destroyAtTarget?: boolean; // destroy the object when it reaches its target position
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
  }

  update(delta: number): void {
    this.updatePosition(delta);
  }

  private updatePosition(delta: number): void {
    if (this.transform.position.local.x === this.targetX && this.transform.position.local.y === this.targetY) {
      if (this.destroyAtTarget) {
        this.flagForDestroy();
      }
      return;
    }

    let movement = new Movement(this.transform.position.local.x, this.transform.position.local.y, this.targetX, this.targetY);
    let velocity = this.movementSpeed * delta;
    let updatedMovement = MovementUtils.moveTowardsPosition(movement, velocity);

    this.transform.position.local.x = updatedMovement.positionX;
    this.transform.position.local.y = updatedMovement.positionY;
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.tileset],
      this.spriteX,
      this.spriteY,
      this.transform.position.local.x,
      this.transform.position.local.y,
      this.spriteWidth,
      this.spriteWidth,
      {
        centered: true,
      }
    );
  }
}
