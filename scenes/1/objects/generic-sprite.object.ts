import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Movement, MovementUtils } from '@utils/movement.utils';
import { RenderUtils } from '@utils/render.utils';

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
const DEFAULT_MOVEMENT_SPEED = 0.5;

export class GenericSpriteObject extends SceneObject {
  hasCollision = true;
  isRenderable = true;
  width = 1;
  height = 1;

  tileset: string;
  spriteX: number;
  spriteY: number;

  movementSpeed: number = DEFAULT_MOVEMENT_SPEED;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);

    if (this.config.isRenderable !== undefined) {
      this.isRenderable = this.config.isRenderable;
    }
    this.tileset = this.config.tileset;
    this.spriteX = this.config.spriteX;
    this.spriteY = this.config.spriteY;

    if (this.config.movementSpeed !== undefined) {
      this.movementSpeed = this.config.movementSpeed;
    }
  }

  update(delta: number): void {
    this.updatePosition(delta);
  }

  private updatePosition(delta: number): void {
    if (this.positionX === this.targetX && this.positionY === this.targetY) {
      if (this.config.destroyAtTarget) {
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
      this.config.spriteWidth,
      this.config.spriteWidth
    );
  }
}
