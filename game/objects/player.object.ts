import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { DirtObject } from '@game/objects/dirt.object';
import { isInteractable } from '@game/models/interactable.model';
import { Input } from '@core/utils/input.utils';
import { useHoe } from '@game/objects/player/use-hoe.action';
import { useWateringCan } from '@game/objects/player/use-watering-can.action';
import { useWateringCanOnDirt } from '@game/objects/player/watering-can/use-watering-can-on-dirt.action';
import { useChicken } from '@game/objects/player/use-chicken.action';
import { useEgg } from '@game/objects/player/use-egg.action';
import { useSeed } from '@game/objects/player/use-seed.action';
import { useSeedOnDirt } from '@game/objects/player/seed/use-seed-on-dirt.action';
import { ChickenObject } from '@game/objects/chicken.object';
import { useCropOnChicken } from '@game/objects/player/crop/use-crop-on-chicken.action';
import { InventoryObject } from '@game/objects/inventory/inventory.object';
import { useWateringCanOnChicken } from './player/watering-can/use-watering-can-on-chicken.action';
import { useChest } from './player/use-chest.action';
import { Assets } from '@core/utils/assets.utils';
import { HotbarObject } from './hotbar/hotbar.object';
import { ObjectFilter } from '@core/model/scene';
import { Inventory, ItemRadius, ItemType } from '@game/models/inventory.model';
import { Control, CONTROL_SCHEME } from '@game/constants/controls.constants';
import { useAxeOnChicken } from './player/axe/use-axe-on-chicken.action';
import { usePickaxeOnChicken } from './player/pickaxe/use-pickaxe-on-chicken.action';
import { RockObject } from './rock.object';
import { usePickaxeOnRock } from './player/pickaxe/use-pickaxe-on-rock.action';
import { TreeObject } from './tree.object';
import { useAxeOnTree } from './player/axe/use-axe-on-tree.action';
import { TreeStumpObject } from './tree-stump.object';
import { useAxeOnTreeStump } from './player/axe/use-axe-on-tree-stump.action';
import { useShovelOnChicken } from './player/shovel/use-shovel-on-chicken.action';
import { useHoeOnChicken } from './player/hoe/use-hoe-on-chicken.action';
import { useShovel } from './player/shovel/use-shovel.action';
import { HoleObject } from './hole.object';
import { useShovelOnHole } from './player/shovel/use-shovel-on-hole.action';
import { useBerryOnHole } from './player/berry/use-berry-on-hole.action';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { UiObject } from '@core/objects/ui.object';
import { Coordinate } from '@core/model/coordinate';
import { Vector } from '@core/model/vector';
import { DeviceType } from '@core/model/device-type';

enum Direction {
  UP = 'w',
  DOWN = 's',
  LEFT = 'a',
  RIGHT = 'd'
}

const TILE_SET = 'tileset_player';

const RENDERER_LAYER: number = 10;

interface Config extends SceneObjectBaseConfig {
  playerIndex: number;
}

export class PlayerObject extends SceneObject {
  playerIndex: number; // player index to be used mainly for controller access for now

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

  private hotbarObject: SceneObject | undefined = undefined;

  // direction state
  direction: Direction = Direction.DOWN;
  directionTime: number = 0;
  directionTimer: number = 0;
  animationIndex: number = 0;
  isIdle: boolean = true;

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

    this.playerIndex = config.playerIndex;
  }


  onAwake(): void {
    this.addHotbar();
  }

  onUpdate(delta: number): void {    
    this.updateMovement(delta);
    this.updateAnimations(delta);
    this.updateAction();
    this.updateButtonInteract();
    this.updateOpenInventory();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderSprite(context);
    this.renderCursor(context);
    // this.renderControllerState(context);
  }

  get hotbar(): Inventory {
    return this.scene.globals.hotbar;
  }

  updateMovement(delta: number): void {
    if (this.scene.globals.player.enabled && this.scene.globals.player.movementEnabled) {
      this.determineNextMovement(delta);
    }

    this.processMovement(delta);
  }

  private determineNextMovement(delta: number): void {
    // check if we are moving
    if (this.targetX !== this.transform.position.world.x || this.targetY !== this.transform.position.world.y) {
      return;
    }

    // check if button pressed
    if(!Input.isPressed<Control>(CONTROL_SCHEME, [Control.Left, Control.Right, Control.Up, Control.Down])){
      return;
    }

    const movement = new Movement(this.transform.position.world.x, this.transform.position.world.y, this.targetX, this.targetY);
    let direction;

    // determine next position and set direction
    if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Right)) {
      movement.targetX += 1;
      direction = Direction.RIGHT;
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Left)) {
      movement.targetX -= 1;
      direction = Direction.LEFT;
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Up)) {
      movement.targetY -= 1;
      direction = Direction.UP;
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Down)) {
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

    const filter: ObjectFilter = {
      boundingBox: targetBoundingBox,
      objectIgnore: new Map([
        [this, true]
      ]),
      collision: {
        enabled: true
      }
    }
    if (this.scene.getObject(filter)) {
      return;
    }

    if (this.scene.isOutOfBounds(movement.targetX, movement.targetY)) {
      return;
    }

    this.targetX = movement.targetX;
    this.targetY = movement.targetY;
  }

  private updateAnimations(delta: number): void {
    if (this.targetX !== this.transform.position.world.x || this.targetY !== this.transform.position.world.y) {
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
    if (this.targetX !== this.transform.position.local.x || this.targetY !== this.transform.position.local.y) {
      let movement = new Movement(this.transform.position.local.x, this.transform.position.local.y, this.targetX, this.targetY);
      let updatedMovement = MovementUtils.moveTowardsPosition(movement, MovementUtils.frameSpeed(this.movementSpeed, delta));

      this.transform.position.local.x = updatedMovement.positionX;
      this.transform.position.local.y = updatedMovement.positionY;
    }
  }

  /**
   * if object player is facing is interactable, run `interact` on that object
   */
  private updateButtonInteract(): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    if (!this.scene.globals.player.interactEnabled) {
      return;
    }

    if(!Input.isPressed<Control>(CONTROL_SCHEME, Control.Interact)){
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.Interact)

    let x = this.transform.position.world.x;
    let y = this.transform.position.world.y;

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

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(x, y, 1, 1),
      objectIgnore: new Map([
        [this, true]
      ]),
    }

    console.log(x, y)

    const object = this.scene.getObject(filter);

    console.log(object);

    if (object === undefined) {
      return;
    }

    if (!isInteractable(object)) {
      return;
    }

    object.interact();
  }

  /**
   * TODO: make 'Direction' a generic concept
   * TODO: this needs to be rounded down
   * @returns
   */
  getPositionFacing(): { x: number; y: number; } {
    let x: number = Math.floor(this.transform.position.world.x);
    let y: number = Math.floor(this.transform.position.world.y);

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

  private updateOpenInventory(): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    if(!Input.isPressed<Control>(CONTROL_SCHEME, Control.OpenInventory)){
      return;
    }

    this.scene.addObject(
      new InventoryObject(
        this.scene,
        {
          positionX: 0,
          positionY: 0,
          player: this,
        }
      )
    );

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.OpenInventory);
  }

  /**
   * LEFT CLICK
   * 
   * if object at position
   *   use item on object
   * else
   *   use item
   */
  private updateAction(): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    if (!this.scene.globals.player.actionsEnabled) {
      return;
    }
    
    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.Action)) {
      return;
    }
    
    // check if UI object at mouse position, if so, cancel this call
    const uiFilter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        Input.mouse.position.x, 
        Input.mouse.position.y, 
        CanvasConstants.TILE_PIXEL_SIZE, 
        CanvasConstants.TILE_PIXEL_SIZE,
      ),
      typeMatch: [UiObject]
    };

    const uiObject = this.scene.getObject(uiFilter, false);

    if(uiObject){
      console.log(uiObject);
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.Action);

    const item = this.scene.selectedInventoryItem;
    // no item selected
    if (item === undefined) {
      return;
    }

    // item cannot be placed
    if (item.radius === ItemRadius.None) {
      return;
    }

    const { x, y } = this.mouseTilePosition;

    if (
      item.radius === ItemRadius.Player &&
      (
        Math.abs(x - this.transform.position.world.roundedX) > 1 ||
        Math.abs(y - this.transform.position.world.roundedY) > 1
      )
    ) {
      return;
    }

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        x, 
        y, 
        CanvasConstants.TILE_PIXEL_SIZE, 
        CanvasConstants.TILE_PIXEL_SIZE,
      ),
      typeIgnore: [UiObject]
    }
    const object = this.scene.getObject(filter);

    // update direction based on action
    this.direction = this.actionDirection;

    if (object === undefined) {
      switch (item.type) {
        case ItemType.Hoe:
          useHoe(this.scene);
          return;
        case ItemType.WateringCan:
          useWateringCan(this.scene);
          return;
        case ItemType.Chicken:
          useChicken(this.scene);
          return;
        case ItemType.Egg:
          useEgg(this.scene);
          return;
        case ItemType.TomatoSeeds:
        case ItemType.WheatSeeds:
          useSeed(this.scene);
          return;
        case ItemType.Chest:
          useChest(this.scene, this);
          return;
        case ItemType.Shovel:
          useShovel(this.scene);
          return;
        default:
          return;
      }
    } else {
      switch (item.type) {
        case ItemType.WateringCan:
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
        case ItemType.TomatoSeeds:
        case ItemType.WheatSeeds:
          switch (true) {
            case object instanceof DirtObject:
              useSeedOnDirt(this.scene, object);
              return;
            default:
              return;
          }
        case ItemType.Tomato:
        case ItemType.Wheat:
          switch (true) {
            case object instanceof ChickenObject:
              useCropOnChicken(this.scene, object);
              return;
            default:
              return;
          }
        case ItemType.Axe:
          switch(true){
            case object instanceof ChickenObject:
              useAxeOnChicken(this.scene, object);
              return;
            case object instanceof TreeObject:
              useAxeOnTree(this.scene, this, object);
              return;
            case object instanceof TreeStumpObject:
              useAxeOnTreeStump(this.scene, object);
              return;
            default:
              return;
          }
        case ItemType.Pickaxe:
          switch(true){
            case object instanceof ChickenObject:
              usePickaxeOnChicken(this.scene, object);
              return;
            case object instanceof RockObject:
              usePickaxeOnRock(this.scene, object);
              return;
            default:
              return;
          }
        case ItemType.Shovel:
          switch(true){
            case object instanceof ChickenObject:
              useShovelOnChicken(this.scene, object);
              return;
            case object instanceof HoleObject:
              useShovelOnHole(this.scene, object);
              return;
            default:
              return;
          }
        case ItemType.Hoe:
          switch(true){
            case object instanceof ChickenObject:
              useHoeOnChicken(this.scene, object);
              return;
            default:
              return;
          }
        case ItemType.Berry:
          switch(true){
            case object instanceof HoleObject:
              useBerryOnHole(this.scene, object);
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
      this.transform.position.world.x,
      this.transform.position.world.y,
    );
  }

  private renderCursor(context: CanvasRenderingContext2D): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    if (!this.scene.globals.player.actionsEnabled) {
      return;
    }

    const x = Math.floor(Input.mouse.position.x + this.scene.globals.camera.startX);
    const y = Math.floor(Input.mouse.position.y + this.scene.globals.camera.startY);

    const item = this.scene.selectedInventoryItem;
    // do not render cursor
    if (item === undefined || item.radius === ItemRadius.None) {
      return;
    }

    // don't render cursor ontop of self
    if (x === this.transform.position.world.roundedX && y === this.transform.position.world.roundedY) {
      return;
    }

    // don't render cursor if greater than 1 tile away from user
    if (
      item.radius === ItemRadius.Player &&
      (
        Math.abs(x - this.transform.position.world.roundedX) > 1 ||
        Math.abs(y - this.transform.position.world.roundedY) > 1
      )
    ) {
      return;
    }

    RenderUtils.fillRectangle(
      context,
      x,
      y,
      1,
      1,
      {
        colour: '#0000ff33',
        type: 'tile'
      }
    );
  }

  private renderControllerState(context: CanvasRenderingContext2D): void {
    // const gamepad = Input.gamepads.get(this.playerIndex);
    const gamepad = navigator.getGamepads()[this.playerIndex];
    if(gamepad === null){
      return;
    }

    gamepad.buttons.forEach((button, index) => {
      RenderUtils.renderText(
        context,
        `${index} - ${button.value} ${button.pressed} ${button.touched}`,
        this.transform.position.world.x,
        this.transform.position.world.y + index,
      );
    });

    gamepad.axes.forEach((axes, index) => {
      RenderUtils.renderText(
        context,
        `${index} - ${axes}`,
        this.transform.position.world.x + 6,
        this.transform.position.world.y + index,
      );
    });

    RenderUtils.renderText(
      context,
      `${gamepad.vibrationActuator}`,
      this.transform.position.world.x + 18,
      this.transform.position.world.y,
    );
  }

  private addHotbar(): void {
    if (this.hotbarObject) {
      return;
    }

    const x = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - this.scene.globals.hotbar.size;
    const y = CanvasConstants.CANVAS_TILE_HEIGHT - 2.5;

    this.hotbarObject = new HotbarObject(
      this.scene, 
      { 
        positionX: x, 
        positionY: y, 
      }
    );

    this.scene.addObject(this.hotbarObject);
  }

  get mouseTilePosition(): Coordinate {
    return {
      x: Math.floor(Input.mouse.position.x + this.scene.globals.camera.startX),
      y: Math.floor(Input.mouse.position.y + this.scene.globals.camera.startY),
    }
  }

  get playerTilePosition(): Coordinate {
    return {
      x: Math.floor(this.transform.position.world.x),
      y: Math.floor(this.transform.position.world.y),
    }
  }

  get actionDirection(): Direction {
    const { x: mouseX, y: mouseY } = this.mouseTilePosition;
    const { x: playerX, y: playerY } = this.playerTilePosition;
    
    const x = mouseX - playerX; 
    const y = mouseY - playerY;
    
    if(y === -1){
      return Direction.UP;
    }

    if(y === 1){
      return Direction.DOWN;
    }

    if(x < 0){
      return Direction.LEFT;
    }

    if(x > 0){
      return Direction.RIGHT;
    }

    // default
    return Direction.DOWN;
  }

}
