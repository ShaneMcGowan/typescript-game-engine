import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { MathUtils } from '@core/utils/math.utils';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { EggObject } from '@game/objects/egg.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type Interactable } from '@game/models/interactable.model';
import { Portrait, TextboxObject } from '@game/objects/textbox.object';
import { InventoryItemType } from '@game/models/inventory-item.model';
import { Assets } from '@core/utils/assets.utils';

const PORTRAIT: Portrait = {
  tileset: 'tileset_chicken',
  x: 0,
  y: 0
}

const TILE_SET: string = 'tileset_chicken';
const RENDERER_LAYER: number = 8;

const DEFAULT_CAN_LAY_EGGS: boolean = false;
const DEFAULT_CAN_MOVE: boolean = false;

const TEXT_STANDARD: string = 'bock bock ... can i help you? ... cluck cluck ...';
const TEXT_ANNOYED: string = "cluck cluck ... you're sort of annoying you know that? ... bock bock ...";
const TEXT_CONFUSED: string = "bock cluck ... is... is this a simulation? ... cluck bock ...";

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
      this.transform.position.local.x,
      this.transform.position.local.y,
      undefined,
      undefined,
      {
        centered: true,
      }
    );
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
      movement = MovementUtils.moveTowardsOtherEntity(
        new Movement(
          this.transform.position.local.x,
          this.transform.position.local.y,
          this.targetX,
          this.targetY
        ),
        {
          positionX: this.following.transform.position.local.x,
          positionY: this.following.transform.position.local.y,
        }
      );
    } else {
      // move in a random direction
      movement = MovementUtils.moveInRandomDirection(
        new Movement(
          this.transform.position.local.x,
          this.transform.position.local.y,
          this.targetX,
          this.targetY
        )
      );
    }

    // cancel if next position would be on top of another entity
    if (this.scene.hasCollisionAtPosition(movement.targetX, movement.targetY, this)) {
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
    if (this.targetX !== this.transform.position.local.x || this.targetY !== this.transform.position.local.y) {
      let movement = new Movement(this.transform.position.local.x, this.transform.position.local.y, this.targetX, this.targetY);
      let updatedMovement = MovementUtils.moveTowardsPosition(movement, MovementUtils.frameSpeed(this.movementSpeed, delta));

      this.transform.position.local.x = updatedMovement.positionX;
      this.transform.position.local.y = updatedMovement.positionY;

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
    if (this.transform.position.local.x > this.targetX || this.transform.position.local.y > this.targetY) {
      roundDirection = Math.ceil;
    } else {
      roundDirection = Math.floor;
    }
    this.scene.addObject(
      new EggObject(this.scene, { positionX: roundDirection(this.transform.position.local.x), positionY: roundDirection(this.transform.position.local.y), })
    );

    this.eggTimer = 0;
  }

  interact(): void {
    this.interactDefault();
  };

  private interactDefault(): void {
    // disable inputs
    this.scene.globals.disable_player_inputs = true;

    let text = '';
    if (this.isEdgyTeen) {
      switch (this.interactionCount % 3){
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
      switch (this.interactionCount % 3){
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

    let textbox = new TextboxObject(
      this.scene,
      {
        text: text,
        portrait: PORTRAIT,
        name: 'Chicken',
        onComplete: () => {
          // enable inputs
          this.scene.globals.disable_player_inputs = false;
        }
      }
    );
    this.scene.addObject(textbox);

    this.interactionCount++;
  }

  actionGiveItem(): void {
    switch (this.scene.selectedInventoryItem.type) {
      case InventoryItemType.Tomato:
        this.actionGiveTomato();
        return;
      case InventoryItemType.Wheat:
        this.actionGiveWheat();
        return;
    }
  }

  private actionGiveTomato(): void {
    // disable inputs
    this.scene.globals.disable_player_inputs = true;

    let textbox = new TextboxObject(
      this.scene,
      {
        text: 'I LOooOooOoOooOoOVE TOMATOES!',
        portrait: PORTRAIT,
        name: 'Chicken',
        onComplete: () => {
          // enable inputs
          this.scene.globals.disable_player_inputs = false;
        }
      }
    );

    let index = this.scene.globals.inventory.indexOf(this.scene.selectedInventoryItem);
    this.scene.removeFromInventory(index)
    this.scene.addObject(textbox);
  }

  private actionGiveWheat(): void {
    // disable inputs
    this.scene.globals.disable_player_inputs = true;

    let textbox = new TextboxObject(
      this.scene,
      {
        text: 'I HAAAAAAAAAAAAAAAATE WHEAT!',
        portrait: PORTRAIT,
        name: 'Chicken',
        onComplete: () => {
          // enable inputs
          this.scene.globals.disable_player_inputs = false;
        }
      }
    );

    this.scene.addObject(textbox);
  }

}
