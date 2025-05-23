import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { MathUtils } from '@core/utils/math.utils';
import { type Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { EggObject } from '@game/objects/egg.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/components/interactable.model';
import { type Portrait, TextboxObject } from '@game/objects/textbox.object';
import { Assets } from '@core/utils/assets.utils';
import { type ObjectFilter } from '@core/model/scene';
import { type Inventory, ItemType } from '@game/models/inventory.model';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';

const PORTRAIT: Portrait = {
  tileset: 'tileset_chicken',
  x: 0,
  y: 0,
  width: 1,
  height: 1,
};

const TILE_SET: string = 'tileset_chicken';
const RENDERER_LAYER: number = 8;

const DEFAULT_CAN_LAY_EGGS: boolean = false;
const DEFAULT_CAN_MOVE: boolean = false;

const TEXT_STANDARD: string = 'bock bock ... can i help you? ... cluck cluck ...';
const TEXT_ANNOYED: string = "cluck cluck ... you're sort of annoying you know that? ... bock bock ...";
const TEXT_CONFUSED: string = 'bock cluck ... is... is this a simulation? ... cluck bock ...';

const TEXT_EDGY_1: string = 'GET OUT OF MY ROOM MOM! GODDDD!!1!';
const TEXT_EDGY_2: string = 'UGHHHH! YOU ARE LIKE SO EMBARRASSING!1!11!';
const TEXT_EDGY_3: string = 'OMG!1!1 JUST LIKE LEAVE ME ALONE!1!11!!';

interface Config extends SceneObjectBaseConfig {
  follows?: SceneObject; // object to follow
  canLayEggs?: boolean;
  canMove?: boolean;
}

export class ChickenObject extends SceneObject implements Interactable {
  targetX: number = -1;
  targetY: number = -1;

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
  eggTimer = MathUtils.randomStartingDelta(2);
  eggTimerMax = 7; // seconds until next egg
  eggMax = 200; // max total chickens + eggs allowed at one time

  // additional flags
  isMovingThisFrame = false;

  // personality
  isEdgyTeen = false;
  interactionCount = 0;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;

    this.targetX = this.transform.position.local.x;
    this.targetY = this.transform.position.local.y;

    this.canLayEggs = config.canLayEggs ?? DEFAULT_CAN_LAY_EGGS;
    this.isEdgyTeen = MathUtils.randomIntFromRange(0, 3) === 3; // 25% chance to be grumpy
    this.canMove = config.canMove ?? DEFAULT_CAN_MOVE;
    this.following = config.follows;

    console.log(this.onRender);
  }

  onUpdate(delta: number): void {
    this.isMovingThisFrame = false;

    this.updateMovement(delta);
    this.updateAnimation(delta);
    this.updateEgg(delta);
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      this.animations.idle[this.animationIndex].x, // sprite x
      this.animations.idle[this.animationIndex].y, // sprite y
      this.transform.position.world.x,
      this.transform.position.world.y,
      undefined,
      undefined,
    );
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
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
      // TODO: add some randomness to movement, can be done later
      movement = MovementUtils.MoveTowardsTarget(
        {
          x: this.transform.position.world.x,
          y: this.transform.position.world.y,
        },
        {
          x: this.following.transform.position.world.x,
          y: this.following.transform.position.world.y,
        }
      );
    } else {
      // move in a random direction
      movement = MovementUtils.MoveInRandomDirection({
        x: this.transform.position.world.x,
        y: this.transform.position.world.y,
      });
    }

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        movement.targetX,
        movement.targetY,
        this.width,
        this.height
      ),
      objectIgnore: new Map([
        [this, true]
      ]),
    };

    // cancel if next position would be on top of another entity
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
    if (this.targetX === this.transform.position.local.x && this.targetY === this.transform.position.local.y) {
      return;
    }

    const coordinates = MovementUtils.MoveTowardsPosition(
      {
        x: this.transform.position.local.x,
        y: this.transform.position.local.y,
      },
      {
        x: this.targetX,
        y: this.targetY,
      },
      MovementUtils.FrameSpeed(this.movementSpeed, delta)
    );

    this.transform.position.local.x = coordinates.x;
    this.transform.position.local.y = coordinates.y;

    // set flag
    this.isMovingThisFrame = true;
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
    const totalObjects = this.scene.getObjects({
      typeMatch: [ChickenObject, EggObject],
    }).length;

    if ((totalObjects) > this.eggMax) {
      return;
    }

    // check direction travelling to ensure that egg is always beneath chicken as they walk away
    let roundDirection;
    if (this.transform.position.world.x > this.targetX || this.transform.position.world.y > this.targetY) {
      roundDirection = Math.ceil;
    } else {
      roundDirection = Math.floor;
    }
    this.scene.addObject(
      new EggObject(this.scene, { x: roundDirection(this.transform.position.world.x), y: roundDirection(this.transform.position.world.y), })
    );

    this.eggTimer = 0;
  }

  interact(): void {
    this.interactDefault();
  };

  private interactDefault(): void {
    let text = '';
    if (this.isEdgyTeen) {
      switch (this.interactionCount % 3) {
        case 0:
          text = TEXT_EDGY_1;
          break;
        case 1:
          text = TEXT_EDGY_2;
          break;
        case 2:
          text = TEXT_EDGY_3;
          break;
      }
    } else {
      switch (this.interactionCount % 3) {
        case 0:
          text = TEXT_STANDARD;
          break;
        case 1:
          text = TEXT_ANNOYED;
          break;
        case 2:
          text = TEXT_CONFUSED;
          break;
      }
    }

    this.say(text);

    this.interactionCount++;
  }

  actionGiveItem(): void {
    switch (this.scene.selectedInventoryItem.type) {
      case ItemType.Tomato:
        this.actionGiveTomato();
        return;
      case ItemType.Wheat:
        this.actionGiveWheat();
    }
  }

  private actionGiveTomato(): void {
    // disable inputs
    this.scene.globals.player.enabled = false;

    let textbox = new TextboxObject(
      this.scene,
      {
        name: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.name,
        portrait: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.portrait,
        text: 'I LOooOooOoOooOoOVE TOMATOES!',
        onComplete: () => {
          // enable inputs
          this.scene.globals.player.enabled = true;
        },
      }
    );

    let index = this.inventory.items.indexOf(this.scene.selectedInventoryItem);
    this.inventory.removeFromInventoryByIndex(index, 1);
    this.scene.addObject(textbox);
  }

  private actionGiveWheat(): void {
    // disable inputs
    this.scene.globals.player.enabled = false;

    let textbox = new TextboxObject(
      this.scene,
      {
        name: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.name,
        portrait: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.portrait,
        text: 'I HAAAAAAAAAAAAAAAATE WHEAT!',
        onComplete: () => {
          // enable inputs
          this.scene.globals.player.enabled = true;
        },
      }
    );

    this.scene.addObject(textbox);
  }

  say(text: string, onComplete?: () => void): void {
    // disable inputs
    this.scene.globals.player.enabled = false;

    // stop movement and store it's state
    const canMoveState = this.canMove;
    this.canMove = false;

    this.scene.addObject(
      new TextboxObject(
        this.scene,
        {
          name: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.name,
          portrait: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.portrait,
          text,
          onComplete: () => {
            if (onComplete) {
              onComplete();
            }

            // enable inputs
            this.scene.globals.player.enabled = true;
            // restore can move
            this.canMove = canMoveState;
          },
        }
      )
    );
  }
}
