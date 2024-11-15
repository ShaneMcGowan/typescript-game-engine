import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { DirtObject } from '@game/objects/dirt.object';
import { InventoryItemRadius, InventoryItemType } from '@game/models/inventory-item.model';
import { isInteractable } from '@game/models/interactable.model';
import { Input, MouseKey } from '@core/utils/input.utils';
import { useHoe } from '@game/objects/player/use-hoe.action';
import { useWateringCan } from '@game/objects/player/use-watering-can.action';
import { useWateringCanOnDirt } from '@game/objects/player/watering-can/use-watering-can-on-dirt.action';
import { useChicken } from '@game/objects/player/use-chicken.action';
import { useEgg } from '@game/objects/player/use-egg.action';
import { useSeed } from '@game/objects/player/use-seed.action';
import { useSeedOnDirt } from '@game/objects/player/seed/use-seed-on-dirt.action';
import { ChickenObject } from '@game/objects/chicken.object';
import { useCropOnChicken } from '@game/objects/player/crop/use-crop-on-chicken.action';
import { InventoryObject } from '@game/objects/inventory.object';
import { useWateringCanOnChicken } from './player/watering-can/use-watering-can-on-chicken.action';
import { useChest } from './player/use-chest.action';
import { Assets } from '@core/utils/assets.utils';

enum Direction {
  UP = 'w',
  DOWN = 's',
  LEFT = 'a',
  RIGHT = 'd'
}

enum Controls {
  Inventory = 'tab',
  Interact = 'e',
  InteractAlt = ' '
}

const TILE_SET = 'tileset_player';

const RENDERER_LAYER: number = 10;

interface Config extends SceneObjectBaseConfig {
}

export class PlayerObject extends SceneObject {
  targetX: number = -1;
  targetY: number = -1;

  // constants
  movementSpeed = 4; // 4 tiles per second

  animations = {
    [Direction.RIGHT]: [{ x: 7, y: 10, }, { x: 10, y: 10, }],
    [Direction.LEFT]: [{ x: 7, y: 7, }, { x: 10, y: 7, }],
    [Direction.UP]: [{ x: 7, y: 4, }, { x: 10, y: 4, }],
    [Direction.DOWN]: [{ x: 7, y: 1, }, { x: 10, y: 1, }],
  };

  animationsIdle = {
    [Direction.RIGHT]: [{ x: 1, y: 10, }, { x: 4, y: 10, }],
    [Direction.LEFT]: [{ x: 1, y: 7, }, { x: 4, y: 7, }],
    [Direction.UP]: [{ x: 1, y: 4, }, { x: 4, y: 4, }],
    [Direction.DOWN]: [{ x: 1, y: 1, }, { x: 4, y: 1, }],
  };

  // direction state
  direction: Direction = Direction.DOWN;
  directionTime: number = 0;
  directionTimer: number = 0;
  animationIndex: number = 0;
  isIdle: boolean = true;

  // state
  movementEnabled: boolean = false;
  hotbarEnabled: boolean = false;
  leftClickEnabled: boolean = false;
  inventoryEnabled: boolean = false;
  interactButtonEnabled: boolean = false;

  // scroll wheel
  latestScrollTimestamp: number; // used to track if the mouse wheel has been scrolled this frame

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;

    this.targetX = this.transform.positionLocal.x;
    this.targetY = this.transform.positionLocal.y;

    this.enableMovement();
    this.enableInteractKeys();
    this.enableInventoryKeys();
    this.enableOtherKeys();
  }

  private enableMovement(): void {
    this.movementEnabled = true;
  }
  private enableOtherKeys(): void {
    this.hotbarEnabled = true;
    this.leftClickEnabled = true;
  }

  private enableInventoryKeys(): void {
    this.inventoryEnabled = true;
  }

  private enableInteractKeys(): void {
    this.interactButtonEnabled = true;
  }

  update(delta: number): void {
    this.updateMovement(delta);
    this.updateAnimations(delta);
    this.updateHotbarViaKey();
    this.updateHotbarViaWheel();
    this.updateLeftClick();
    this.updateButtonInteract();
    this.updateOpenInventory();

    // update at end of frame after checks have been ran
    this.latestScrollTimestamp = Input.mouse.wheel.event.timeStamp;
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
    this.renderCursor(context);
  }

  updateMovement(delta: number): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.movementEnabled === false) {
      return;
    }

    this.determineNextMovement(delta);
    this.processMovement(delta);
  }

  private determineNextMovement(delta: number): void {
    // check if we are moving
    if (this.targetX !== this.transform.positionLocal.x || this.targetY !== this.transform.positionLocal.y) {
      return;
    }

    // check if button pressed
    if (!Input.isKeyPressed([Direction.RIGHT, Direction.LEFT, Direction.UP, Direction.DOWN])) {
      return;
    }

    let movement = new Movement(this.transform.positionLocal.x, this.transform.positionLocal.y, this.targetX, this.targetY);
    let direction;

    // determine next position and set direction
    if (Input.isKeyPressed(Direction.RIGHT)) {
      movement.targetX += 1;
      direction = Direction.RIGHT;
    } else if (Input.isKeyPressed(Direction.LEFT)) {
      movement.targetX -= 1;
      direction = Direction.LEFT;
    } else if (Input.isKeyPressed(Direction.UP)) {
      movement.targetY -= 1;
      direction = Direction.UP;
    } else if (Input.isKeyPressed(Direction.DOWN)) {
      movement.targetY += 1;
      direction = Direction.DOWN;
    }

    // update direction regardless of movement
    // reset animations if new direction
    if (this.direction !== direction) {
      this.direction = direction;
      this.directionTime = 0;
      this.directionTimer = 0;
    } else {
      this.directionTimer += delta;
    }

    // if direction has not been held for 5 frames, do not move
    if (this.directionTimer < 0.05) {
      return;
    }

    // check if can move to position
    const targetBoundingBox = SceneObject.calculateBoundingBox(
      movement.target.x,
      movement.target.y,
      this.width,
      this.height
    );

    if (this.scene.hasCollisionAtBoundingBox(targetBoundingBox, this)) {
      return;
    }

    if (this.scene.isOutOfBounds(movement.targetX, movement.targetY)) {
      return;
    }

    this.targetX = movement.targetX;
    this.targetY = movement.targetY;
  }

  private updateAnimations(delta: number): void {
    if (this.targetX !== this.transform.positionLocal.x || this.targetY !== this.transform.positionLocal.y) {
      this.isIdle = false;
    } else {
      this.isIdle = true;
    }

    if (this.isIdle) {
      // idle
      if (this.directionTime < 0.5) {
        this.animationIndex = 0;
      } else {
        this.animationIndex = 1;
      }
    } else {
      if (this.directionTime < 0.25) {
        this.animationIndex = 0;
      } else if (this.directionTime < 0.5) {
        this.animationIndex = 1;
      } else if (this.directionTime < 0.75) {
        this.animationIndex = 0;
      } else {
        this.animationIndex = 1;
      }
    }

    this.directionTime = (this.directionTime + delta) % 1;
  }

  private processMovement(delta: number): void {
    if (this.targetX !== this.transform.positionLocal.x || this.targetY !== this.transform.positionLocal.y) {
      let movement = new Movement(this.transform.positionLocal.x, this.transform.positionLocal.y, this.targetX, this.targetY);
      let updatedMovement = MovementUtils.moveTowardsPosition(movement, MovementUtils.frameSpeed(this.movementSpeed, delta));

      this.transform.positionLocal.x = updatedMovement.positionX;
      this.transform.positionLocal.y = updatedMovement.positionY;
    }
  }

  /**
   * if object player is facing is interactable, run `interact` on that object
   */
  private updateButtonInteract(): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.interactButtonEnabled === false) {
      return;
    }

    if (!Input.isKeyPressed([Controls.Interact, Controls.InteractAlt])) {
      return;
    }

    Input.clearKeyPressed([Controls.Interact, Controls.InteractAlt]);

    let x = this.transform.positionLocal.x;
    let y = this.transform.positionLocal.y;

    switch (this.direction) {
      case Direction.UP:
        y -= 1
        break;
      case Direction.RIGHT:
        x += 1
        break;
      case Direction.DOWN:
        y += 1
        break;
      case Direction.LEFT:
        x -= 1
        break;
    }

    let object = this.scene.getObjectAtPosition(x, y, this);
    if (object === undefined) {
      return;
    }

    if (!isInteractable(object)) {
      return;
    }

    object.interact();
  }

  destroy(): void {
    // TODO: what needs to be cleaned up here? are we sure the object is being properly released?
  }

  /**
   * TODO: make 'Direction' a generic concept
   * TODO: this needs to be rounded down
   * @returns
   */
  getPositionFacing(): { x: number; y: number; } {
    let x: number = Math.floor(this.transform.positionLocal.x);
    let y: number = Math.floor(this.transform.positionLocal.y);

    if (this.direction === Direction.RIGHT) {
      return { x: x + 1, y, };
    } else if (this.direction === Direction.LEFT) {
      return { x: x - 1, y, };
    } else if (this.direction === Direction.UP) {
      return { x, y: y - 1, };
    } else if (this.direction === Direction.DOWN) {
      return { x, y: y + 1, };
    }
  }

  private updateHotbarViaKey(): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.hotbarEnabled === false) {
      return;
    }

    if (Input.isKeyPressed('1') === true) {
      this.scene.globals['hotbar_selected_index'] = 0;
      return;
    }

    if (Input.isKeyPressed('2') === true) {
      this.scene.globals['hotbar_selected_index'] = 1;
      return;
    }

    if (Input.isKeyPressed('3') === true) {
      this.scene.globals['hotbar_selected_index'] = 2;
      return;
    }

    if (Input.isKeyPressed('4') === true) {
      this.scene.globals['hotbar_selected_index'] = 3;
      return;
    }

    if (Input.isKeyPressed('5') === true) {
      this.scene.globals['hotbar_selected_index'] = 4;
      return;
    }

    // TODO: this is hard coded, if hotbar size changes this won't work properly
  }

  private updateHotbarViaWheel(): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.hotbarEnabled === false) {
      return;
    }

    // no new scroll events this frame
    if (this.latestScrollTimestamp === Input.mouse.wheel.event.timeStamp) {
      return;
    }

    // wrap hotbar if at end
    const index = this.scene.globals['hotbar_selected_index'];
    if (Input.mouse.wheel.event.deltaY > 0) {
      if (index === this.scene.globals.hotbar_size - 1) {
        this.scene.globals['hotbar_selected_index'] = 0;
      } else {
        this.scene.globals['hotbar_selected_index']++;
      }
    } else if (Input.mouse.wheel.event.deltaY < 0) {
      if (index === 0) {
        this.scene.globals['hotbar_selected_index'] = this.scene.globals.hotbar_size - 1;
      } else {
        this.scene.globals['hotbar_selected_index']--;
      }
    }

  }

  private updateOpenInventory(): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.inventoryEnabled === false) {
      return;
    }

    let keys = [Controls.Inventory];

    if (Input.isKeyPressed(keys) === false) {
      return;
    }

    this.scene.addObject(
      new InventoryObject(
        this.scene,
        {
          positionX: 0,
          positionY: 0,
        }
      )
    );

    Input.clearKeyPressed(keys);
  }

  /**
   * LEFT CLICK
   * 
   * if object at position
   *   use item on object
   * else
   *   use item
   */
  private updateLeftClick(): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.leftClickEnabled === false) {
      return;
    }

    if (!Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    const item = this.scene.selectedInventoryItem;
    // no item selected
    if (item === undefined) {
      return;
    }

    // item cannot be placed
    if(item.radius === InventoryItemRadius.None){
      return;
    }

    const x = Math.round(Input.mouse.position.x + this.scene.globals.camera.startX);
    const y = Math.round(Input.mouse.position.y + this.scene.globals.camera.startY);

    if (
      item.radius === InventoryItemRadius.Player && 
      Math.abs(x - this.transform.positionLocal.roundedX) > 1 || 
      Math.abs(y - this.transform.positionLocal.roundedY) > 1
     ) {
      return;
    }

    const object = this.scene.getObjectAtPosition(
      x,
      y,
    );

    if (object === undefined) {
      switch (item.type) {
        case InventoryItemType.Hoe:
          useHoe(this.scene);
          return;
        case InventoryItemType.WateringCan:
          useWateringCan(this.scene);
          return;
        case InventoryItemType.Chicken:
          useChicken(this.scene);
          return;
        case InventoryItemType.Egg:
          useEgg(this.scene);
          return;
        case InventoryItemType.TomatoSeeds:
        case InventoryItemType.WheatSeeds:
          useSeed(this.scene);
          return;
        case InventoryItemType.Chest:
          useChest(this.scene);
          return;
        default:
          return;
      }
    } else {
      switch (item.type) {
        case InventoryItemType.WateringCan:
          switch (true) {
            case object instanceof DirtObject:
              useWateringCanOnDirt(this.scene, object);
              return;
            case object instanceof ChickenObject:
              useWateringCanOnChicken(this.scene, object);
              return;
            default:
              return;
          }
        case InventoryItemType.TomatoSeeds:
        case InventoryItemType.WheatSeeds:
          switch (true) {
            case object instanceof DirtObject:
              useSeedOnDirt(this.scene, object);
              return;
            default:
              return;
          }
        case InventoryItemType.Tomato:
        case InventoryItemType.Wheat:
          switch (true) {
            case object instanceof ChickenObject:
              useCropOnChicken(this.scene, object);
              return;
            default:
              return;
          }
        default:
          return;
      }
    }
  }

  private renderSprite(context: CanvasRenderingContext2D): void {
    let animations = this.isIdle ? this.animationsIdle : this.animations;
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      animations[this.direction][this.animationIndex].x, // sprite x
      animations[this.direction][this.animationIndex].y, // sprite y
      this.transform.positionLocal.x,
      this.transform.positionLocal.y,
      undefined,
      undefined,
      {
        centered: true,
      }
    );
  }

  private renderCursor(context: CanvasRenderingContext2D): void {
    if (!this.leftClickEnabled) {
      return;
    }

    let x = Math.round(Input.mouse.position.x + this.scene.globals.camera.startX);
    let y = Math.round(Input.mouse.position.y + this.scene.globals.camera.startY);

    let item = this.scene.selectedInventoryItem;
    // do not render cursor
    if (item === undefined || item.radius === InventoryItemRadius.None) {
      return;
    }

    // don't render cursor ontop of self
    if (x === this.transform.positionLocal.roundedX && y === this.transform.positionLocal.roundedY) {
      return;
    }

    // don't render cursor if greater than 1 tile away from user
    if (
      item.radius === InventoryItemRadius.Player && 
      Math.abs(x - this.transform.positionLocal.roundedX) > 1 || 
      Math.abs(y - this.transform.positionLocal.roundedY) > 1
     ) {
      return;
    }

    RenderUtils.fillRectangle(
      context,
      x - 0.5,
      y - 0.5,
      1,
      1,
      {
        colour: '#0000ff33',
        type: 'tile'
      }
    );
  }

}
