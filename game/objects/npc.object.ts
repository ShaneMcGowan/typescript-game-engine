import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { MathUtils } from '@core/utils/math.utils';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { Portrait, TextboxObject } from '@game/objects/textbox.object';
import { SpriteAnimation } from '@core/model/sprite-animation';
import { Assets } from '@core/utils/assets.utils';
import { ObjectFilter } from '@core/model/scene';
import { Quest } from '@game/models/quest.model';
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { PlayerObject } from './player.object';
import { TileConfig } from '@game/models/tile.model';
import { Direction } from '@game/models/direction.model';
import { Inventory } from '@game/models/inventory.model';
import { InventoryObject, InventoryType } from './inventory/inventory.object';

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
const DEFAULT_PORTRAIT: Portrait = {
  tileset: '',
  x: 0,
  y: 0,
  width: 0,
  height: 0
};
const DEFAULT_DIALOGUE_INTRO: string = '';
const DEFAULT_DIALOGUE_DEFAULT: string = '';
const DEFAULT_DIRECTION: Direction = Direction.Down;

export type NpcState = 'idle' | 'moving';

export interface NpcDetails {
  name: string;
  portrait: Portrait;
}

export interface NpcDialogue {
  intro: string;
  default: string;
}

export interface NpcObjectConfig extends SceneObjectBaseConfig {
  follows?: SceneObject; // object to follow
  canMove?: boolean;
  movementSpeed?: number;
  movementDelay?: number;
  direction?: Direction;
}

export class NpcObject extends SceneObject implements Interactable {
  state: NpcState = 'idle';

  inventory: Inventory = new Inventory(5, 3);

  targetX: number = -1;
  targetY: number = -1;

  // animation
  direction: Direction;
  animation = {
    index: 0,
    timer: MathUtils.randomStartingDelta(4),
  };

  // movement
  canMove: boolean;
  following: SceneObject | undefined;
  movementSpeed: number; // tiles per second
  movementDelay: number | undefined; // seconds until next move
  movementTimer = MathUtils.randomStartingDelta(2);

  // config
  quests: Quest[] = [];

  constructor(
    protected scene: SCENE_GAME,
    protected config: NpcObjectConfig
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = PlayerObject.RENDERER_LAYER + 1;

    this.targetX = this.transform.position.local.x;
    this.targetY = this.transform.position.local.y;
    this.canMove = config.canMove ?? DEFAULT_CAN_MOVE;
    this.following = config.follows;
    this.movementSpeed = config.movementSpeed ?? DEFAULT_MOVEMENT_SPEED;
    this.movementDelay = config.movementDelay ?? DEFAULT_MOVEMENT_DELAY;
    this.direction = config.direction ?? DEFAULT_DIRECTION;
  }

  onUpdate(delta: number): void {
    this.updateMovement(delta);
    this.updateAnimationTimer(delta);
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
    this.renderIcon(context);
  }

  onDestroy(): void { }

  get details(): NpcDetails {
    return {
      name: DEFAULT_NAME,
      portrait: DEFAULT_PORTRAIT,
    }
  }

  get dialogue(): NpcDialogue {
    return {
      intro: DEFAULT_DIALOGUE_INTRO,
      default: DEFAULT_DIALOGUE_DEFAULT,
    }
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return DEFAULT_ANIMATIONS;
  }

  /**
   * returns true if a quest intro has been seen but quest has not been completed
   */
  get hasActiveQuest(): boolean {
    return this.quests.some(quest => {
      const status = this.scene.globals.quests[quest.id];

      if (status.complete) {
        return false;
      }

      if (status.intro) {
        return true;
      }

      return false;
    })
  }

  /**
   * returns true if an quests are incomplete
   */
  get hasAvailableQuest(): boolean {
    return this.quests.some(quest => {
      const status = this.scene.globals.quests[quest.id];

      if (status.complete) {
        return false;
      }

      return true;
    })
  }

  get introFlag(): SceneFlag {
    return SceneFlag.intro_default;
  }

  get introSeen(): boolean {
    return this.scene.globals.flags[this.introFlag];
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
          this.transform.position.world.x,
          this.transform.position.world.y,
          this.targetX,
          this.targetY
        ),
        {
          x: this.following.transform.position.world.x,
          y: this.following.transform.position.world.y,
        }
      );
    } else {
      // move in a random direction
      movement = MovementUtils.moveInRandomDirection(
        new Movement(
          this.transform.position.world.x,
          this.transform.position.world.y,
          this.targetX,
          this.targetY
        )
      );
    }

    // cancel if next position would be on top of another entity
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        movement.targetX,
        movement.targetY,
        this.width,
        this.height
      ),
      objectIgnore: new Map([
        [this, true]
      ])
    }
    if (this.scene.getObject(filter)) {
      return;
    }

    // TODO: disable for now, see player.object.ts for info
    // if (this.scene.willHaveCollisionAtPosition(movement.targetX, movement.targetY, this)) {
    //   return;
    // }

    if (this.scene.isOutOfBounds(movement.targetX, movement.targetY)) {
      return;
    }

    this.targetX = movement.targetX;
    this.targetY = movement.targetY;
  }

  private processMovement(delta: number): void {
    if (this.targetX !== this.transform.position.world.x || this.targetY !== this.transform.position.world.y) {
      let movement = new Movement(this.transform.position.world.x, this.transform.position.world.y, this.targetX, this.targetY);
      let updatedMovement = MovementUtils.moveTowardsPosition(movement, MovementUtils.frameSpeed(this.movementSpeed, delta));

      this.transform.position.world.x = updatedMovement.x;
      this.transform.position.world.y = updatedMovement.y;
    }
  }

  interact(): void {
    if (!this.introSeen) {
      this.scene.setFlag(this.introFlag, true);
      this.say(
        this.dialogue.intro,
        () => { this.onIntro() },
      );
      return;
    }

    for (const quest of this.quests) {
      if (quest.isComplete) {
        continue;
      }

      // run first incomplete quest 
      quest.run();
      return;
    }

    // default
    this.say(
      this.dialogue.default,
      () => { this.onDefault() },
    );
  };

  onIntro(): void { }
  onDefault(): void { }

  say(text: string, onComplete?: () => void): void {
    this.scene.globals.player.enabled = false;

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          name: this.details.name,
          portrait: this.details.portrait,
          text: text,
          onComplete: () => {
            if (onComplete) {
              onComplete();
            }
            this.scene.globals.player.enabled = true;
          }
        }
      )
    );
  }

  private renderSprite(context: CanvasRenderingContext2D): void {
    let animation = this.animations[this.state];
    let frame = animation.currentFrame(this.animation.timer);

    RenderUtils.renderSprite(
      context,
      Assets.images[animation.tileset],
      frame.spriteX,
      frame.spriteY,
      this.transform.position.world.x - (((frame.spriteWidth ?? 1) - 1) / 2),
      this.transform.position.world.y - (((frame.spriteHeight ?? 1) - 1) / 2),
      frame.spriteWidth ?? 1,
      frame.spriteHeight ?? 1,
      {
        opacity: this.renderer.opacity,
        scale: this.renderer.scale,
        centered: true,
      }
    );
  }

  private renderIcon(context: CanvasRenderingContext2D): void {
    if (this.hasActiveQuest) {
      this.iconRenderer(
        context,
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.QuestionMark.White.Default
        },
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.QuestionMark.Darker.Default
        },
      );
      return;
    }

    if (this.hasAvailableQuest) {
      this.iconRenderer(
        context,
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.ExclamationMark.White.Default
        },
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.ExclamationMark.Darker.Default
        },
      );
      return;
    }
  }

  private iconRenderer(
    context: CanvasRenderingContext2D,
    foreground: {
      id: string,
      tile: TileConfig
    },
    background: {
      id: string,
      tile: TileConfig
    }
  ): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[background.id],
      background.tile.x,
      background.tile.y,
      this.transform.position.world.x - CanvasConstants.TILE_PIXEL_SIZE,
      this.transform.position.world.y - 1 - CanvasConstants.TILE_PIXEL_SIZE,
      background.tile.width,
      background.tile.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[foreground.id],
      foreground.tile.x,
      foreground.tile.y,
      this.transform.position.world.x,
      this.transform.position.world.y - 1,
      foreground.tile.width,
      foreground.tile.height,
    );
  }
  
  openInventory(): void {
    this.scene.addObject(new InventoryObject(
      this.scene,
      {
        otherInventory: this.inventory,
        type: this.inventoryType,
      }
    ))
  }

  get inventoryType(): InventoryType {
    return InventoryType.Inventory;
  }

}
