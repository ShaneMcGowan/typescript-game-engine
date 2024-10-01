import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { MathUtils } from '@core/utils/math.utils';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/interactable.model';
import { TextboxObject } from '@game/objects/textbox.object';
import { SpriteAnimation } from '@core/model/sprite-animation';

const DEFAULT_RENDER_LAYER: number = 8;
const DEFAULT_CAN_MOVE: boolean = false;
const DEFAULT_ANIMATIONS: Record<NpcState, SpriteAnimation> = {
  idle: new SpriteAnimation('tileset_chicken', [
    { spriteX: 0, spriteY: 0, duration: 3.5, },
    { spriteX: 1, spriteY: 0, duration: 0.5, }
  ]),
  moving: new SpriteAnimation('tileset_chicken', [
    { spriteX: 0, spriteY: 0, duration: 3.5, },
    { spriteX: 1, spriteY: 0, duration: 0.5, }
  ]),
};
const DEFAULT_MOVEMENT_SPEED: number = 2;
const DEFAULT_MOVEMENT_DELAY: number | undefined = undefined;
const DEFAULT_NAME: string = '???';

type NpcState = 'idle' | 'moving';

export interface NpcObjectConfig extends SceneObjectBaseConfig {
  follows?: SceneObject; // object to follow
  canMove?: boolean;
  dialogue?: string;
  animations?: Record<NpcState, SpriteAnimation>;
  movementSpeed?: number;
  movementDelay?: number;
  name?: string;
}

export class NpcObject extends SceneObject implements Interactable {
  state: NpcState = 'idle';

  isRenderable = true;
  hasCollision = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  width = 1;
  height = 1;

  // animation
  animation = {
    index: 0,
    timer: 0, // TODO: enable adding random start with MathUtils.randomStartingDelta(4),
  };

  name: string;

  animations: Record<string, SpriteAnimation>;

  // movement
  canMove: boolean;
  following: SceneObject | undefined;
  movementSpeed: number; // tiles per second
  movementDelay: number | undefined; // seconds until next move
  movementTimer = MathUtils.randomStartingDelta(2);

  // interaction
  dialogue: string | undefined;

  constructor(
    protected scene: SCENE_GAME,
    config: NpcObjectConfig
  ) {
    super(scene, config);

    this.canMove = config.canMove ?? DEFAULT_CAN_MOVE;
    this.following = config.follows;
    this.dialogue = config.dialogue;
    this.animations = config.animations ?? DEFAULT_ANIMATIONS;
    this.movementSpeed = config.movementSpeed ?? DEFAULT_MOVEMENT_SPEED;
    this.movementDelay = config.movementDelay ?? DEFAULT_MOVEMENT_DELAY;
    this.name = config.name ?? DEFAULT_NAME;
  }

  update(delta: number): void {
    this.updateMovement(delta);
    this.updateAnimationTimer(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    let animation = this.animations[this.state];
    let frame = animation.currentFrame(this.animation.timer);

    RenderUtils.renderSprite(
      context,
      this.assets.images[animation.tileset],
      frame.spriteX,
      frame.spriteY,
      this.positionX,
      this.positionY,
      undefined,
      undefined,
      {
        opacity: this.renderOpacity,
        scale: this.renderScale,
      }
    );
  }

  destroy(): void {
    console.log('[NpcObject#destroy]', this);
  }

  private updateAnimationTimer(delta: number): void {
    this.animation.timer = (this.animation.timer + delta) % this.animations[this.state].duration;
  }

  private updateMovement(delta: number): void {
    if (!this.canMove) {
      return;
    }

    this.movementTimer += delta;

    // determine next movement
    if ((this.movementDelay === undefined && this.movementTimer > this.movementSpeed) || this.movementTimer > this.movementDelay) {
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
      // TODO: add some randomness to movement, can be done later
      // TODO: this logic is dumb and can get stuck if no clear path
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
        portrait: this.name, // TODO: new to implement proper portrait system
        name: this.name,
      }
    );
    this.scene.addObject(textbox);
  };
}
