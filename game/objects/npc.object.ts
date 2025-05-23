import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { MathUtils } from '@core/utils/math.utils';
import { MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { type SceneFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { type Portrait, TextboxObject } from '@game/objects/textbox.object';
import { SpriteAnimation } from '@core/model/sprite-animation';
import { Assets } from '@core/utils/assets.utils';
import { type Quest } from '@game/models/quest.model';
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { PlayerObject } from './player.object';
import { type TileConfig } from '@game/models/tile.model';
import { Direction } from '@game/models/direction.model';
import { Inventory } from '@game/models/inventory.model';
import { InventoryObject, InventoryType } from './inventory/inventory.object';
import { assertUnreachable } from '@core/utils/typescript.utils';
import { type Coordinate } from '@core/model/coordinate';
import { type ObjectFilter } from '@core/model/scene';
import { UiObject } from '@core/objects/ui.object';
import { AreaObject } from './areas/area.object';

export enum MovementType {
  None = 'None', // doesn't move
  Follow = 'Follow', // follows a target if provided, otherwise same as None
  Random = 'Random', // moves in a random direction
  Goal = 'Goal' // move to target x and target y
}

export interface InteractionStage {
  text: string;
  callback?: () => void;
  enablePlayer?: boolean;
  disablePlayer?: boolean;
}

export interface InteractionStageIntro extends InteractionStage {
  flag: SceneFlag;
}

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

const DEFAULT_MOVEMENT_TYPE: MovementType = MovementType.None;
const DEFAULT_MOVEMENT_SPEED: number = 2;
const DEFAULT_MOVEMENT_DELAY: number | undefined = undefined;
const DEFAULT_PATH_RADIUS: number = 8;
const DEFAULT_PATH_DELAY: number = 2;

const DEFAULT_NAME: string = '???';
const DEFAULT_PORTRAIT: Portrait = {
  tileset: '',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
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
  movementType?: MovementType;
  movementDelay?: number;
  direction?: Direction;

  goal?: Coordinate;
  onGoal?: () => void;
}

export class NpcObject extends SceneObject implements Interactable {
  state: NpcState = 'idle';

  inventory: Inventory = new Inventory(5, 3);

  // animation
  direction: Direction;
  animation = {
    index: 0,
    timer: MathUtils.randomStartingDelta(4),
  };

  // movement
  movementType: MovementType;
  movementDelayTimer: number = 0;
  pathDelayTimer: number; // wait 2 seconds before trying to calculate path as it is expensive
  following: SceneObject | undefined;

  target: Coordinate = { x: 0, y: 0, };
  goal: Coordinate | undefined = undefined;
  onGoal: () => void = () => { };
  path: Coordinate[] = [];

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

    this.target.x = this.transform.position.local.x;
    this.target.y = this.transform.position.local.y;

    this.movementType = config.movementType ?? DEFAULT_MOVEMENT_TYPE;
    this.following = config.follows;
    this.direction = config.direction ?? DEFAULT_DIRECTION;
    this.goal = config.goal ?? this.goal;
    this.onGoal = config.onGoal ?? this.onGoal;
    this.pathDelayTimer = this.pathDelay;
  }

  onUpdate(delta: number): void {
    this.updateTargetPosition(delta);
    this.updatePosition(delta);
    this.updateAnimationTimer(delta);
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
    this.renderIcon(context);

    if (CanvasConstants.DEBUG_MODE) {
      this.renderRadius(context);
      this.renderPath(context);
    }
  }

  onDestroy(): void { }

  get movementSpeed(): number {
    return DEFAULT_MOVEMENT_SPEED;
  }

  get movementDelay(): number | undefined {
    return DEFAULT_MOVEMENT_DELAY;
  }

  get pathRadius(): number {
    return DEFAULT_PATH_RADIUS;
  }

  get pathDelay(): number {
    return DEFAULT_PATH_DELAY;
  }

  get atTarget(): boolean {
    return this.transform.position.local.x === this.target.x && this.transform.position.local.y === this.target.y;
  }

  get intro(): InteractionStageIntro | undefined {
    return undefined;
  }

  get default(): InteractionStage | undefined {
    return undefined;
  }

  get name(): string {
    return DEFAULT_NAME;
  }

  get portrait(): Portrait {
    return DEFAULT_PORTRAIT;
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
    });
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
    });
  }

  private updateAnimationTimer(delta: number): void {
    this.animation.timer = (this.animation.timer + delta) % this.animations[this.state].duration;
  }

  private updatePosition(delta: number): void {
    if (this.atTarget) {
      return;
    }

    const coordinates = MovementUtils.MoveTowardsPosition(
      {
        x: this.transform.position.local.x,
        y: this.transform.position.local.y,
      },
      {
        x: this.target.x,
        y: this.target.y,
      },
      MovementUtils.FrameSpeed(this.movementSpeed, delta)
    );

    this.transform.position.local.x = coordinates.x;
    this.transform.position.local.y = coordinates.y;
  }

  private updateTargetPosition(delta: number): void {
    if (this.movementType === MovementType.None) {
      this.target.x = this.transform.position.local.x;
      this.target.y = this.transform.position.local.y;
      return;
    }

    if (!this.atTarget) {
      return;
    }

    // delay
    this.movementDelayTimer += delta;
    if (this.movementDelay && this.movementDelayTimer < this.movementDelay) {
      return;
    }
    this.movementDelayTimer = 0;

    // update target
    switch (this.movementType) {
      case MovementType.Follow:
        this.updateTargetPositionObject(delta);
        return;
      case MovementType.Goal:
        this.updateTargetPositionGoal(delta);
        return;
      case MovementType.Random:
        this.updateTargetPositionRandom();
        break;
      default:
        assertUnreachable(this.movementType);
    }
  }

  /**
   *  check if path is undefined
   *      exists          - continue
   *      does not exist  - calculate
   *  check if next coordinate in path is valid
   *      valid       - set target to next coordinate
   *      not valid   - invalidate path, recalculate path
   * @returns
   */
  private updateTargetPositionGoal(delta: number): void {
    if (this.goal === undefined) {
      return;
    }

    if (this.goal.x === this.transform.position.world.x && this.goal.y === this.transform.position.world.y) {
      this.goal = undefined;
      this.onGoal();
      return;
    }

    this.pathDelayTimer += delta;

    if (this.path.length === 0 && this.pathDelayTimer > this.pathDelay) {
      this.pathDelayTimer = 0;

      this.generatePath({
        x: this.goal.x,
        y: this.goal.y,
      });
    }

    const target = this.path.pop();
    if (target === undefined) {
      return;
    }

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        target.x,
        target.y,
        this.width,
        this.height
      ),
      collision: {
        enabled: true,
      },
      objectIgnore: new Map([
        [this, true]
      ]),
      typeIgnore: [UiObject, AreaObject],
    };

    const object = this.scene.getObject(filter);
    if (object) {
      this.path = [];
      return;
    }

    this.target.x = target.x;
    this.target.y = target.y;
  }

  /**
   *  check if path is undefined
   *      exists          - continue
   *      does not exist  - calculate
   *  check if next coordinate in path is valid
   *      valid       - set target to next coordinate
   *      not valid   - invalidate path, recalculate path
   * @param delta
   * @returns
   */
  private updateTargetPositionObject(delta: number): void {
    if (this.following === undefined) {
      return;
    }

    // clear path
    if (this.path.length > 0) {
      this.pathDelayTimer = DEFAULT_PATH_DELAY;
      this.path = [];
    }

    const x = this.following.transform.position.world.x;
    const y = this.following.transform.position.world.y;

    const xDifference = Math.abs(x - this.transform.position.world.x);
    const yDifference = Math.abs(y - this.transform.position.world.y);

    if (
      (xDifference === 1 && yDifference === 0) ||
      (xDifference === 0 && yDifference === 1)
    ) {
      return;
    }

    this.pathDelayTimer += delta;

    if (this.path.length === 0 && this.pathDelayTimer > this.pathDelay) {
      this.pathDelayTimer = 0;
    }

    this.generatePath({
      x: Math.floor(x),
      y: Math.floor(y),
    });

    const target = this.path.pop();
    if (target === undefined) {
      return;
    }

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        target.x,
        target.y,
        this.width,
        this.height
      ),
      collision: {
        enabled: true,
      },
      objectIgnore: new Map([
        [this, true]
      ]),
      typeIgnore: [UiObject, AreaObject],
    };

    const object = this.scene.getObject(filter);
    if (object) {
      this.path = [];
      return;
    }

    this.target.x = target.x;
    this.target.y = target.y;
  }

  private updateTargetPositionRandom(): void {
    const movement = MovementUtils.MoveInRandomDirection({
      x: this.transform.position.world.x,
      y: this.transform.position.world.y,
    });

    // TODO: check if position is valid, if not, don't move

    this.target.x = movement.target.x;
    this.target.y = movement.target.y;
  }

  interact(): void {
    // intro
    if (this.intro && !this.scene.getFlag(this.intro.flag)) {
      this.scene.setFlag(this.intro.flag, true);

      this.say(
        this.intro.text,
        {
          onComplete: () => {
            if (this.intro.callback) {
              this.intro.callback();
            }
          },
          enablePlayer: this.intro.enablePlayer,
          disablePlayer: this.intro.disablePlayer,
        }
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
    if (this.default) {
      this.say(
        this.default.text,
        {
          onComplete: () => {
            if (this.default.callback) {
              this.default.callback();
            }
          },
          enablePlayer: this.default.enablePlayer,
          disablePlayer: this.default.disablePlayer,
        }
      );
    }
  };

  say(
    text: string, options: {
      onComplete?: () => void,
      disablePlayer?: boolean,
      enablePlayer?: boolean
    } = {}
  ): void {
    const disablePlayer = options.disablePlayer ?? true;
    const enablePlayer = options.enablePlayer ?? true;
    const onComplete: () => void = options.onComplete ?? (() => { });

    if (disablePlayer) {
      this.scene.globals.player.enabled = false;
    }

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          name: this.name,
          portrait: this.portrait,
          text,
          onComplete: () => {
            onComplete();
            if (enablePlayer) {
              this.scene.globals.player.enabled = true;
            }
          },
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
      }
    );
  }

  private renderIcon(context: CanvasRenderingContext2D): void {
    if (this.hasActiveQuest) {
      this.iconRenderer(
        context,
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.QuestionMark.White.Default,
        },
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.QuestionMark.Darker.Default,
        }
      );
      return;
    }

    if (this.hasAvailableQuest) {
      this.iconRenderer(
        context,
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.ExclamationMark.White.Default,
        },
        {
          id: TilesetBasic.id,
          tile: TilesetBasic.ExclamationMark.Darker.Default,
        }
      );
    }
  }

  private iconRenderer(
    context: CanvasRenderingContext2D,
    foreground: {
      id: string;
      tile: TileConfig;
    },
    background: {
      id: string;
      tile: TileConfig;
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
      background.tile.height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[foreground.id],
      foreground.tile.x,
      foreground.tile.y,
      this.transform.position.world.x,
      this.transform.position.world.y - 1,
      foreground.tile.width,
      foreground.tile.height
    );
  }

  openInventory(): void {
    this.scene.addObject(new InventoryObject(
      this.scene,
      {
        otherInventory: this.inventory,
        type: this.inventoryType,
      }
    ));
  }

  get inventoryType(): InventoryType {
    return InventoryType.Inventory;
  }

  setPositionGoal(x: number, y: number, callback: () => void, delay?: number): void {
    this.goal = {
      x,
      y,
    };
    this.onGoal = callback;

    // set delay so we move immediately
    this.pathDelayTimer = delay ? this.pathDelay - delay : this.pathDelay;
  }

  private generatePath(target: Coordinate): void {
    // clear path
    this.path = [];

    const parentForCell = new Map();

    const queue: Coordinate[] = [];

    // start position
    const start: Coordinate = {
      x: this.transform.position.world.x,
      y: this.transform.position.world.y,
    };

    // prevent outside radius
    if (Math.abs(start.x - target.x) > this.pathRadius) {
      return;
    }

    if (Math.abs(start.y - target.y) > this.pathRadius) {
      return;
    }

    queue.push(start);

    while (queue.length > 0) {
      const current = queue.shift();
      const currentKey = `${current.x}x${current.y}`;

      const neighbours = [
        { x: current.x - 1, y: current.y, },
        { x: current.x, y: current.y + 1, },
        { x: current.x + 1, y: current.y, },
        { x: current.x, y: current.y - 1, }
      ];

      for (let i = 0; i < neighbours.length; ++i) {
        const nX = neighbours[i].x;
        const nY = neighbours[i].y;

        // limit radius
        if (Math.abs(nX - target.x) > this.pathRadius) {
          continue;
        }

        if (Math.abs(nY - target.y) > this.pathRadius) {
          continue;
        }

        const filter: ObjectFilter = {
          boundingBox: SceneObject.calculateBoundingBox(
            nX,
            nY,
            this.width,
            this.height
          ),
          typeIgnore: [UiObject, AreaObject],
          collision: {
            enabled: true,
          },
        };
        const object = this.scene.getObject(filter);
        if (object && (target.x !== nX || target.y !== nY)) {
          continue;
        }

        const key = `${nX}x${nY}`;

        // already visited
        if (parentForCell.get(key)) {
          continue;
        }

        parentForCell.set(
          key,
          {
            key: currentKey,
            cell: current,
          }
        );

        queue.push(neighbours[i]);
      }
    }

    let currentKey = `${target.x}x${target.y}`;
    let current = target;

    while (current !== start) {
      this.path.push(current);

      console.log(this.path);

      if (parentForCell.get(currentKey) === undefined) {
        // too far away / no path
        this.path = [];
        return;
      }
      const { key, cell, } = parentForCell.get(currentKey);

      currentKey = key;
      current = cell;
    }
  }

  private renderRadius(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.world.x - this.pathRadius,
      this.transform.position.world.y - this.pathRadius,
      this.pathRadius * 2 + 1,
      this.pathRadius * 2 + 1,
      {
        colour: '#00FF0033',
        type: 'tile',
      }
    );
  }

  private renderPath(context: CanvasRenderingContext2D): void {
    this.path.forEach(position => {
      RenderUtils.fillRectangle(
        context,
        position.x,
        position.y,
        1,
        1,
        {
          colour: '#FF00FF33',
          type: 'tile',
        }
      );
    });
  }
}
