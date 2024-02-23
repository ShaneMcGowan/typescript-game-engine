import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { MathUtils } from '@utils/math.utils';
import { Movement, MovementUtils } from '@utils/movement.utils';
import { RenderUtils } from '@utils/render.utils';
import { EggObject } from './egg.object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { type Interactable } from '../models/interactable.model';
import { TextboxObject } from './textbox.object';

const TILE_SET: string = 'tileset_chicken';
const DEFAULT_RENDER_LAYER: number = 8;

const DEFAULT_CAN_LAY_EGGS: boolean = false;
const DEFAULT_CAN_MOVE: boolean = false;

const TEXT_STANDARD: string = 'bock bock... can i help you? ... cluck cluck ...';
const TEXT_EDGY: string = 'GET OUT OF MY ROOM MOM! GODDDD!!!!';

interface Config extends SceneObjectBaseConfig {
  follows?: SceneObject; // object to follow
  canLayEggs?: boolean;
  canMove?: boolean;
}

export class ChickenObject extends SceneObject implements Interactable {
  isRenderable = true;
  hasCollision = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  width = 1;
  height = 1;

  // animation
  animations = {
    idle: [{ x: 0, y: 0, }, { x: 1, y: 0, }],
  };

  animationTimer = MathUtils.randomStartingDelta(4);
  animationIndex = 0;

  // movement
  canMove: boolean;
  following: SceneObject | undefined;
  movementSpeed = 2; // tiles per second
  movementTimer = MathUtils.randomStartingDelta(2);
  movementDelay = 2; // seconds until next movement

  // egg
  canLayEggs: boolean;
  eggTimer = MathUtils.randomStartingDelta(2); ;
  eggTimerMax = 7; // seconds until next egg
  eggMax = 200; // max total chickens + eggs allowed at one time

  // additional flags
  isMovingThisFrame = false;

  // personality
  isEdgyTeen = false;

  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    console.log('[ChickenObject] created');
    super(scene, config);
    this.canLayEggs = config.canLayEggs ? config.canLayEggs : DEFAULT_CAN_LAY_EGGS;
    this.isEdgyTeen = MathUtils.randomIntFromRange(0, 3) === 3; // 25% chance to be grumpy
    this.canMove = config.canMove ? config.canMove : DEFAULT_CAN_MOVE;
    this.following = config.follows ? config.follows : undefined;
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

  destroy(): void {
    console.log('[ChickenObject] destroyed');
  }

  private updateAnimation(delta: number): void {
    this.animationTimer = (this.animationTimer + delta) % 4;
    if (this.animationTimer < 3.5) {
      this.animationIndex = 0;
    } else {
      this.animationIndex = 1;
    }
  }

  private updateMovement(delta: number): void {
    if (!this.canMove) {
      return;
    }

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
    if (this.following) {
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
          this.following.positionX,
          this.following.positionY,
          this.following.targetX,
          this.following.targetY
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
    if (!this.canLayEggs) {
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

  interact(): void {
    console.log('[ChickenObject#interact] TODO(smg): pick up chicken');
    let textbox = new TextboxObject(
      this.scene,
      { text: this.isEdgyTeen ? TEXT_EDGY : TEXT_STANDARD, portrait: 'Chicken', name: 'Chicken', }
    );
    this.scene.addObject(textbox);
  };
}
