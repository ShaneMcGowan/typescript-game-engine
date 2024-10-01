import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { DirtObject } from '@game/objects/dirt.object';
import { InventoryItemType } from '@game/models/inventory-item.model';
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
import { Position } from '@game/models/position.model';

enum Direction {
  UP = 'w',
  DOWN = 's',
  LEFT = 'a',
  RIGHT = 'd'
}

enum Controls {
  Inventory = 'tab',
  InventoryAlt = 'escape'
}

interface IControls {
  ['click']: boolean;
}

const TILE_SET = 'tileset_player';

const DEFAULT_RENDER_LAYER: number = 10;

interface Config extends SceneObjectBaseConfig {
}

export class PlayerObject extends SceneObject {
  isRenderable = true;
  hasCollision = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  width = 1;
  height = 1;

  // constants
  movementSpeed = 4; // 4 tiles per second

  controls: IControls = {
    ['click']: false,
  };

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
  rightClickEnabled: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);

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
    this.rightClickEnabled = true;
  }


  update(delta: number): void {
    this.updateMovement(delta);
    this.updateAnimations(delta);
    this.updateHotbar();
    this.updateLeftClick();
    this.updateRightClick();
    this.updateOpenInventory();
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
    if (this.targetX !== this.positionX || this.targetY !== this.positionY) {
      return;
    }

    // check if button pressed
    if (!Input.isKeyPressed(Direction.RIGHT) && !Input.isKeyPressed(Direction.LEFT) && !Input.isKeyPressed(Direction.UP) && !Input.isKeyPressed(Direction.DOWN)) {
      return;
    }

    let movement = new Movement(this.positionX, this.positionY, this.targetX, this.targetY);
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
    if (this.scene.hasCollisionAtPosition(movement.targetX, movement.targetY)) {
      return;
    }
    if (this.scene.willHaveCollisionAtPosition(movement.targetX, movement.targetY)) {
      return;
    }
    if (this.scene.isOutOfBounds(movement.targetX, movement.targetY)) {
      return;
    }

    this.targetX = movement.targetX;
    this.targetY = movement.targetY;
  }

  private updateAnimations(delta: number): void {
    if (this.targetX !== this.positionX || this.targetY !== this.positionY) {
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
    if (this.targetX !== this.positionX || this.targetY !== this.positionY) {
      let movement = new Movement(this.positionX, this.positionY, this.targetX, this.targetY);
      let updatedMovement = MovementUtils.moveTowardsPosition(movement, MovementUtils.frameVelocity(this.movementSpeed, delta));

      this.positionX = updatedMovement.positionX;
      this.positionY = updatedMovement.positionY;
    }
  }

  /**
  * RIGHT CLICK
  * 
  * if object at position
  *   interact item
  * else
  *   use item (or nothing)
  */
  private updateRightClick(): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.rightClickEnabled === false) {
      return;
    }

    if (!Input.mouse.click.right) {
      return;
    }

    Input.mouse.click.right = false;

    let position = {
      x: Math.ceil(Input.mouse.position.x + this.scene.globals.camera.startX),
      y: Math.ceil(Input.mouse.position.y + this.scene.globals.camera.startY)
    };
    let object = this.scene.getObjectAtPosition(position.x, position.y, null);

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
    let x: number = Math.floor(this.positionX);
    let y: number = Math.floor(this.positionY);

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

  private updateHotbar(): void {
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

    if (Input.isKeyPressed('6') === true) {
      this.scene.globals['hotbar_selected_index'] = 5;
      return;
    }

    if (Input.isKeyPressed('7') === true) {
      this.scene.globals['hotbar_selected_index'] = 6;
      return;
    }

    if (Input.isKeyPressed('8') === true) {
      this.scene.globals['hotbar_selected_index'] = 7;
      return;
    }

    if (Input.isKeyPressed('9') === true) {
      this.scene.globals['hotbar_selected_index'] = 8;
      return;
    }
  }

  private updateOpenInventory(): void {
    if (this.scene.globals.disable_player_inputs === true) {
      return;
    }

    if (this.inventoryEnabled === false) {
      return;
    }

    let keys = [Controls.Inventory, Controls.InventoryAlt];

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

    let item = this.scene.selectedInventoryItem;
    // no item selected
    if (item === undefined) {
      return;
    }

    // only allow selection of 1 tile radius surrounding player
    let position = this.calculateRelativeMousePosition();

    let object = this.scene.getObjectAtPosition(
      position.x,
      position.y,
      null
    );

    if (object === undefined) {
      switch (item.type) {
        case InventoryItemType.Hoe:
          useHoe(this.scene, position);
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
      this.assets.images[TILE_SET],
      animations[this.direction][this.animationIndex].x, // sprite x
      animations[this.direction][this.animationIndex].y, // sprite y
      this.positionX,
      this.positionY
    );
  }

  private renderCursor(context: CanvasRenderingContext2D): void {
    if (!this.leftClickEnabled) {
      return;
    }


    let x = Input.mouse.position.x; // TODO: work with camera + this.scene.globals.camera.startX;
    let y = Input.mouse.position.y; // TODO: work with camera + this.scene.globals.camera.startY;

    // don't render cursor ontop of self
    if (x === Math.floor(this.positionX) && y === Math.floor(this.positionY)) {
      return;
    }

    /*
    // top left
    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_ui,
      9,
      9,
      x - 0.5,
      y - 0.5,
      1,
      1
    );

    // top right
    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_ui,
      10,
      9,
      x + 0.5,
      y - 0.5,
      1,
      1
    );

    // bottom left
    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_ui,
      9,
      10,
      x - 0.5,
      y + 0.5,
      1,
      1
    );

    // bottom right
    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_ui,
      10,
      10,
      x + 0.5,
      y + 0.5,
      1,
      1
    );
    */
  }

  private calculateRelativeMousePosition(): Position {
    // only allow selection of 1 tile radius surrounding player
    // x
    let xCalculation = Input.mouse.position.x - this.positionX;
    let xOffset: number;
    if (xCalculation === 0) {
      xOffset = 0
    } else if (xCalculation > 0) {
      xOffset = 1
    } else {
      xOffset = -1
    }
    // y
    let yCalculation = Input.mouse.position.y - this.positionY;
    let yOffset: number;
    if (yCalculation === 0) {
      yOffset = 0
    } else if (yCalculation > 0) {
      yOffset = 1
    } else {
      yOffset = -1
    }

    return {
      x: this.positionX + xOffset,
      y: this.positionY + yOffset
    }
  }
}
