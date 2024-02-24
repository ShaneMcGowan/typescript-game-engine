import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Movement, MovementUtils } from '@utils/movement.utils';
import { RenderUtils } from '@utils/render.utils';

const DEFAULT_DESTROYED_AT_TARGET = false;
const DEFAULT_MOVEMENT_SPEED = 0.5;

interface Config extends SceneObjectBaseConfig {
  tileset: string;
  spriteX: number;
  spriteY: number;
  spriteWidth?: number;
  spriteHeight?: number;
  isRenderable?: boolean;
  destroyAtTarget?: boolean; // destroy the object when it reaches its target position
  movementSpeed?: number;
}

/**
 * A generic sprite object that can be used to render a sprite from a tileset.
 */
export class GenericSpriteObject extends SceneObject {
  isRenderable = true;
  width = 1;
  height = 1;

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

    if (config.isRenderable !== undefined) {
      this.isRenderable = config.isRenderable;
    }
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
    if (this.positionX === this.targetX && this.positionY === this.targetY) {
      if (this.destroyAtTarget) {
        this.scene.removeObject(this);
      }
      return;
    }

    let movement = new Movement(this.positionX, this.positionY, this.targetX, this.targetY);
    let velocity = this.movementSpeed * delta;
    let updatedMovement = MovementUtils.moveTowardsPosition(movement, velocity);

    this.positionX = updatedMovement.positionX;
    this.positionY = updatedMovement.positionY;
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[this.tileset],
      this.spriteX,
      this.spriteY,
      this.positionX,
      this.positionY,
      this.spriteWidth,
      this.spriteWidth
    );
  }
}
