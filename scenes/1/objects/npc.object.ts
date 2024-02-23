import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { MathUtils } from '@utils/math.utils';
import { Movement, MovementUtils } from '@utils/movement.utils';
import { RenderUtils } from '@utils/render.utils';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { type Interactable } from '../models/interactable.model';
import { TextboxObject } from './textbox.object';
import { SpriteAnimation } from '@core/model/sprite-animation';

const DEFAULT_RENDER_LAYER: number = 8;
const DEFAULT_CAN_MOVE: boolean = false;

interface Config extends SceneObjectBaseConfig {
  follows?: SceneObject; // object to follow
  canMove?: boolean;
  dialogue?: string;
}

export class NpcObject extends SceneObject implements Interactable {
  state: 'idle' | 'moving' = 'idle';

  isRenderable = true;
  hasCollision = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  width = 1;
  height = 1;

  // animation
  animation = {
    index: 0,
    timer: 0, // TODO(smg): enable adding random start with MathUtils.randomStartingDelta(4),
  };

  // TODO(smg): this is hardcoded
  animations: Record<string, SpriteAnimation> = {
    idle: new SpriteAnimation('tileset_chicken', [
      { spriteX: 0, spriteY: 0, duration: 3.5, },
      { spriteX: 1, spriteY: 0, duration: 0.5, }
    ]),
  };

  // movement
  canMove: boolean;
  following: SceneObject | undefined;
  movementSpeed = 2; // tiles per second
  movementTimer = MathUtils.randomStartingDelta(2);
  movementDelay = 2; // seconds until next movement

  // interaction
  dialogue: string | undefined;

  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    super(scene, config);

    this.canMove = config.canMove ? config.canMove : DEFAULT_CAN_MOVE;
    this.following = config.follows ? config.follows : undefined;
    this.dialogue = config.dialogue ? config.dialogue : undefined;
  }

  update(delta: number): void {
    this.updateMovement(delta);
    this.updateAnimationTimer(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    let frame = this.animations.idle.currentFrame(this.animation.timer);

    RenderUtils.renderSprite(
      context,
      this.assets.images[this.animations.idle.tileset],
      frame.spriteX,
      frame.spriteY,
      this.positionX,
      this.positionY
    );
  }

  destroy(): void {
    console.log('[NpcObject#destroy]');
  }

  private updateAnimationTimer(delta: number): void {
    // TODO(smg): this is hard coded and should be either moved to config or make another class extend NpcObject and make NpcObject abstract
    this.animation.timer = (this.animation.timer + delta) % this.animations.idle.duration;
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
      // move towards object
      // TODO(smg): add some randomness to movement, can be done later
      // TODO(smg): this logic is dumb and can get stuck if no clear path
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
    }
  }

  interact(): void {
    console.log('[NpcObject#interact]');

    if (this.dialogue === undefined) {
      return;
    }

    let textbox = new TextboxObject(
      this.scene,
      {
        text: this.dialogue,
        portrait: true,
      }
    );
    this.scene.addObject(textbox);
  };
}
