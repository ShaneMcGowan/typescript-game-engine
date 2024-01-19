import { type Scene } from '@model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { MathUtils } from '@utils/math.utils';
import { Movement, MovementUtils } from '@utils/movement.utils';
import { RenderUtils } from '@utils/render.utils';
import { EggObject } from './egg.object';

const TILE_SET: string = 'tileset_chicken';
const DEFAULT_RENDER_LAYER: number = 8;

interface Config extends SceneObjectBaseConfig {
  follows: SceneObject; // object to follow
  canLayEggs?: boolean;
}

export class ChickenObject extends SceneObject {
  isRenderable = true;
  hasCollision = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  // animation
  animations = {
    idle: [{ x: 0, y: 0, }, { x: 1, y: 0, }],
  };

  animationTimer = MathUtils.randomStartingDelta(4);
  animationIndex = 0;

  // movement
  movementSpeed = 2; // tiles per second
  movementTimer = MathUtils.randomStartingDelta(2);
  movementDelay = 2; // seconds until next movement

  // egg
  eggEnabled: boolean;
  eggTimer = MathUtils.randomStartingDelta(2); ;
  eggTimerMax = 7; // seconds until next egg
  eggMax = 200; // max total chickens + eggs allowed at one time

  // additional flags
  isMovingThisFrame = false;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);
    this.eggEnabled = this.config.canLayEggs ?? true;
  }

  update(delta: number): void {
    this.isMovingThisFrame = false;

    this.updateMovement(delta);
    this.updateAnimation(delta);
    this.updateEgg(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      this.animations.idle[this.animationIndex].x, // sprite x
      this.animations.idle[this.animationIndex].y, // sprite y
      this.positionX,
      this.positionY
    );
  }

  destroy?(): void {}

  private updateAnimation(delta: number): void {
    this.animationTimer = (this.animationTimer + delta) % 4;
    if (this.animationTimer < 3.5) {
      this.animationIndex = 0;
    } else {
      this.animationIndex = 1;
    }
  }

  private updateMovement(delta: number): void {
    this.movementTimer += delta;

    // determine next movement
    if (this.movementTimer > this.movementDelay) {
      this.determineNextMovement(delta);
    }

    // process movement
    this.processMovement(delta);
  }

  private determineNextMovement(delta: number): void {
    this.movementTimer = 0;

    let movement: Movement;
    if (this.scene.globals.chickens_follow_player === true) {
      // move towards player
      // TODO(smg): add some randomness to movement, can be done later
      movement = MovementUtils.moveTowardsOtherEntity(
        new Movement(
          this.positionX,
          this.positionY,
          this.targetX,
          this.targetY
        ),
        new Movement(
          this.config.follows.positionX,
          this.config.follows.positionY,
          this.config.follows.targetX,
          this.config.follows.targetY
        )
      );
    } else {
      // move in a random direction
      movement = MovementUtils.moveInRandomDirection(
        new Movement(
          this.positionX,
          this.positionY,
          this.targetX,
          this.targetY
        )
      );
    }

    // cancel if next position would be on top of another entity
    if (this.scene.hasCollisionAtPosition(movement.targetX, movement.targetY, this)) {
      return;
    }

    if (this.scene.willHaveCollisionAtPosition(movement.targetX, movement.targetY, this)) {
      return;
    }

    if (this.scene.isOutOfBounds(movement.targetX, movement.targetY)) {
      return;
    }

    this.targetX = movement.targetX;
    this.targetY = movement.targetY;
  }

  private processMovement(delta: number): void {
    if (this.targetX !== this.positionX || this.targetY !== this.positionY) {
      let movement = new Movement(this.positionX, this.positionY, this.targetX, this.targetY);
      let updatedMovement = MovementUtils.moveTowardsPosition(movement, MovementUtils.frameVelocity(this.movementSpeed, delta));

      this.positionX = updatedMovement.positionX;
      this.positionY = updatedMovement.positionY;

      // set flag
      this.isMovingThisFrame = true;
    }
  }

  private updateEgg(delta: number): void {
    if (!this.eggEnabled) {
      return;
    }

    this.eggTimer += delta;

    if (this.eggTimer < this.eggTimerMax) {
      return;
    }

    // only lay egg if moving
    if (!this.isMovingThisFrame) {
      return;
    }

    // only lay egg if there are less than 10 chickens
    let totalChickens = this.scene.getObjectsByType(ChickenObject).length;
    let totalEggs = this.scene.getObjectsByType(EggObject).length;
    if ((totalChickens + totalEggs) > this.eggMax) {
      return;
    }

    // check direction travelling to ensure that egg is always beneath chicken as they walk away
    let roundDirection;
    if (this.positionX > this.targetX || this.positionY > this.targetY) {
      roundDirection = Math.ceil;
    } else {
      roundDirection = Math.floor;
    }
    this.scene.addObject(
      new EggObject(this.scene, { positionX: roundDirection(this.positionX), positionY: roundDirection(this.positionY), })
    );

    this.eggTimer = 0;
  }
}
