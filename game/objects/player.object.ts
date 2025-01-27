import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { isInteractable } from '@game/models/components/interactable.model';
import { Input } from '@core/utils/input.utils';
import { useHoe } from '@game/objects/player/hoe/use-hoe.action';
import { useWateringCan } from '@game/objects/player/watering-can/use-watering-can.action';
import { useChicken } from '@game/objects/player/use-chicken.action';
import { useEgg } from '@game/objects/player/use-egg.action';
import { useSeed } from '@game/objects/player/use-seed.action';
import { InventoryObject } from '@game/objects/inventory/inventory.object';
import { useChest } from './player/use-chest.action';
import { Assets } from '@core/utils/assets.utils';
import { HotbarObject } from './hotbar/hotbar.object';
import { ObjectFilter } from '@core/model/scene';
import { Inventory, ItemRadius, ItemType, ItemTypeFurnitureItem } from '@game/models/inventory.model';
import { Control, CONTROL_SCHEME } from '@game/constants/controls.constants';
import { useShovel } from './player/shovel/use-shovel.action';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { UiObject } from '@core/objects/ui.object';
import { Coordinate } from '@core/model/coordinate';
import { ObjectAnimation, PlayerActionAnimationCallback } from '@game/constants/animations/player.animations';
import { usePickaxe } from './player/pickaxe/use-pickaxe.action';
import { AreaObject } from './areas/area.object';
import { useFurnitureItem } from './player/furniture/use-furniture-item.action';
import { useFurnitureWall } from './player/furniture/use-furniture-wall.action';
import { useFurnitureFloor } from './player/furniture/use-furniture-floor.action';
import { CollisionObject } from './collision.object';
import { assertUnreachable } from '@core/utils/typescript.utils';
import { useCrop } from './player/crop/use-crop.action';
import { useAxe } from './player/axe/use-axe.action';
import { useBerry } from './player/berry/use-berry.action';
import { FurnitureFloorObject } from './furniture/furniture-floor.object';
import { FurnitureUtils } from '@game/utils/furniture.utils';
import { use } from '@game/objects/player/use.action';
import { IconsObject } from './icons/icons.object';
import { Direction } from '@game/models/direction.model';
import { WarpObject } from './warp.object';

const TILE_SET = 'tileset_player';

interface Config extends SceneObjectBaseConfig {
  playerIndex: number;
}

export class PlayerObject extends SceneObject {

  static RENDERER_LAYER: number = 10;

  playerIndex: number; // player index to be used mainly for controller access for now

  targetX: number = -1;
  targetY: number = -1;

  // constants
  movementSpeed = 4; // 4 tiles per second

  animations = {
    [Direction.Right]: [{ x: 7, y: 10, }, { x: 10, y: 10, }],
    [Direction.Left]: [{ x: 7, y: 7, }, { x: 10, y: 7, }],
    [Direction.Up]: [{ x: 7, y: 4, }, { x: 10, y: 4, }],
    [Direction.Down]: [{ x: 7, y: 1, }, { x: 10, y: 1, }],
  };

  animationsIdle = {
    [Direction.Right]: [{ x: 1, y: 10, }, { x: 4, y: 10, }],
    [Direction.Left]: [{ x: 1, y: 7, }, { x: 4, y: 7, }],
    [Direction.Up]: [{ x: 1, y: 4, }, { x: 4, y: 4, }],
    [Direction.Down]: [{ x: 1, y: 1, }, { x: 4, y: 1, }],
  };

  private hotbarObject: SceneObject | undefined = undefined;

  // direction state
  direction: Direction = Direction.Down;
  directionTime: number = 0;
  directionTimer: number = 0;
  animationIndex: number = 0;
  isIdle: boolean = true;

  // animation state
  animation: ObjectAnimation | undefined;
  animationDelta: number = 0;
  animationCallback: PlayerActionAnimationCallback | undefined;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = PlayerObject.RENDERER_LAYER;

    this.targetX = this.transform.position.local.x;
    this.targetY = this.transform.position.local.y;

    this.playerIndex = config.playerIndex;
  }

  onAwake(): void {
    this.addHotbar();
    this.scene.addObject(new IconsObject(this.scene, { x: 0, y: 0 }));
  }

  onUpdate(delta: number): void {
    this.updateMovement(delta);
    this.updateAnimations(delta);
    this.updateAnimation(delta);
    this.updateAction();
    this.updateButtonInteract();
    this.updateOpenInventory();
  }

  onRender(context: CanvasRenderingContext2D): void {
    if (this.animation) {
      this.renderAnimation(context);
    } else {
      this.renderSprite(context);
    }
    this.renderCursor(context);
    // this.renderControllerState(context);
  }

  get hotbar(): Inventory {
    return this.scene.globals.hotbar;
  }

  get isAnimating(): boolean {
    return this.animation !== undefined;
  }

  get isMoving(): boolean {
    return this.transform.position.world.x !== this.targetX || this.transform.position.world.y !== this.targetY;
  }

  updateMovement(delta: number): void {
    // if (!this.scene.globals.player.enabled) {
    //   return;
    // }

    // if (!this.scene.globals.player.movementEnabled) {
    //   return;
    // }

    if (
      this.scene.globals.player.enabled
      && this.scene.globals.player.movementEnabled
      && !this.isAnimating
    ) {
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
    if (!Input.isPressed<Control>(CONTROL_SCHEME, [Control.Left, Control.Right, Control.Up, Control.Down])) {
      return;
    }

    const movement = new Movement(this.transform.position.world.x, this.transform.position.world.y, this.targetX, this.targetY);
    let direction;

    // determine next position and set direction
    if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Right)) {
      movement.targetX += 1;
      direction = Direction.Right;
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Left)) {
      movement.targetX -= 1;
      direction = Direction.Left;
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Up)) {
      movement.targetY -= 1;
      direction = Direction.Up;
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Down)) {
      movement.targetY += 1;
      direction = Direction.Down;
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
  }

  startAnimation(animation: any, callback?: PlayerActionAnimationCallback): void {
    this.animation = animation;
    this.animationDelta = 0;
    this.animationCallback = callback;
  }

  endAnimation(): void {
    this.animation = undefined;
    this.animationDelta = 0;
  }

  private updateAnimation(delta: number): void {
    if (!this.isAnimating) {
      return;
    }

    this.animationDelta += delta;

    const frameLength = this.animation.length / this.animation.frames.length;
    const finalFrameStart = frameLength * (this.animation.frames.length - 1);

    // run callback on start of final frame as it looks more natural than after animation has stopped
    if (this.animationDelta > finalFrameStart && this.animationCallback) {
      this.animationCallback();
      this.animationCallback = undefined;
    }

    if (this.animationDelta > this.animation.length) {
      this.endAnimation();
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

    if (this.isAnimating) {
      return;
    }

    if (this.isMoving) {
      return;
    }

    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.Interact)) {
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.Interact)

    let x = this.transform.position.world.x;
    let y = this.transform.position.world.y;

    switch (this.direction) {
      case Direction.Up:
        y -= 1
        break;
      case Direction.Right:
        x += 1
        break;
      case Direction.Down:
        y += 1
        break;
      case Direction.Left:
        x -= 1
        break;
    }

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(x, y, 1, 1),
      typeIgnore: [UiObject, AreaObject, CollisionObject, FurnitureFloorObject, WarpObject],
      objectIgnore: new Map([
        [this, true]
      ]),
    }

    console.log(x, y);

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

    if (this.direction === Direction.Right) {
      return { x: x + 1, y, };
    } else if (this.direction === Direction.Left) {
      return { x: x - 1, y, };
    } else if (this.direction === Direction.Up) {
      return { x, y: y - 1, };
    } else if (this.direction === Direction.Down) {
      return { x, y: y + 1, };
    }
  }

  private updateOpenInventory(): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    if (this.isAnimating) {
      return;
    }

    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.OpenInventory)) {
      return;
    }

    this.scene.addObject(
      new InventoryObject(
        this.scene,
        {
          x: 0,
          y: 0,
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

    if (this.isAnimating) {
      return;
    }

    if (this.isMoving) {
      return;
    }

    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.Action)) {
      return;
    }

    // update direction based on action
    this.direction = this.actionDirection;

    console.log(this.mouseTilePosition);

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

    if (uiObject) {
      console.log(uiObject);
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.Action);

    const { x, y } = this.mouseTilePosition;
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        x,
        y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      ),
      typeIgnore: [UiObject, AreaObject, CollisionObject]
    }
    const object = this.scene.getObject(filter);

    const item = this.scene.selectedInventoryItem;
    // no item selected
    if (item === undefined) {
      use(this.scene, this, object);
      return;
    }

    // item cannot be placed
    if (Inventory.getItemRadius(item.type) === ItemRadius.None) {
      return;
    }

    const neighbours = [...this.neighbourTiles];

    if (
      Inventory.getItemRadius(item.type) === ItemRadius.Player
      && !neighbours.some(n => n.x === x && n.y === y)
    ) {
      return;
    }

    switch (item.type) {
      case ItemType.Hoe:
        useHoe(this.scene, this, object);
        return;
      case ItemType.WateringCan:
        useWateringCan(this.scene, this, object);
        return;
      case ItemType.Chicken:
        useChicken(this.scene, this, object);
        return;
      case ItemType.Egg:
        useEgg(this.scene, this, object);
        return;
      case ItemType.TomatoSeeds:
      case ItemType.WheatSeeds:
        useSeed(this.scene, this, object);
        return;
      case ItemType.Chest:
        useChest(this.scene, this, object);
        return;
      case ItemType.Shovel:
        useShovel(this.scene, this, object);
        return;
      case ItemType.Pickaxe:
        usePickaxe(this.scene, this, object)
        return;
      case ItemType.FurnitureBed:
      case ItemType.FurnitureTable:
      case ItemType.FurnitureLamp:
        useFurnitureItem(this.scene, item.type);
        return;
      case ItemType.FurniturePainting:
        useFurnitureWall(this.scene, item.type);
        return;
      case ItemType.FurnitureRugLarge:
        useFurnitureFloor(this.scene, item.type);
        return;
      case ItemType.Wheat:
      case ItemType.Tomato:
        useCrop(this.scene, this, object);
        return;
      case ItemType.Axe:
        useAxe(this.scene, this, object);
        return;
      case ItemType.Berry:
        useBerry(this.scene, this, object);
        return;
      case ItemType.GateKey:
      case ItemType.HouseKey:
      case ItemType.Rock:
      case ItemType.Log:
        return;
      default:
        assertUnreachable(item.type);
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
    if (item === undefined || Inventory.getItemRadius(item.type) === ItemRadius.None || Inventory.getItemRadius(item.type) === ItemRadius.Player) {
      return;
    }

    // don't render cursor ontop of self
    if (x === this.transform.position.world.flooredX && y === this.transform.position.world.flooredY) {
      return;
    }

    // don't render cursor if greater not a neighbouring tile to user
    // removing this for now, but will
    // const neighbours = [...this.neighbourTiles];
    // if (
    //   item.radius === ItemRadius.Player && !neighbours.some(n => n.x === x && n.y === y)
    // ){
    //   return;
    // }

    let width: number = 1;
    let height: number = 1;

    // TODO: this is hardcoded and will need to be updated later if more furniture added
    if (item.type === ItemType.FurnitureRugLarge) {
      width = 2;
    }

    const colourDefault: string = '#0000ff33';
    const colour = FurnitureUtils.cursor(this.scene, x, y, item.type) ?? colourDefault;

    RenderUtils.fillRectangle(
      context,
      x,
      y,
      width,
      height,
      {
        colour,
        type: 'tile'
      }
    );
  }

  private renderAnimation(context: CanvasRenderingContext2D): void {
    const frameLength: number = this.animation.length / this.animation.frames.length;

    let sprite;
    for (let i = 0; i < this.animation.frames.length; i++) {
      const frameStart = frameLength * i;
      if (this.animationDelta >= frameStart) {
        sprite = this.animation.frames[i];
      }
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[this.animation.tileset],
      sprite.x,
      sprite.y,
      this.transform.position.world.x - 1,
      this.transform.position.world.y - 1,
      this.animation.width,
      this.animation.height,
    );
  }

  private renderControllerState(context: CanvasRenderingContext2D): void {
    // const gamepad = Input.gamepads.get(this.playerIndex);
    const gamepad = navigator.getGamepads()[this.playerIndex];
    if (gamepad === null) {
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
        x: x,
        y: y,
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

  get neighbourTiles(): Coordinate[] {
    return [
      // top
      {
        x: this.transform.position.world.x - 1,
        y: this.transform.position.world.y - 1,
      },
      {
        x: this.transform.position.world.x,
        y: this.transform.position.world.y - 1,
      },
      {
        x: this.transform.position.world.x + 1,
        y: this.transform.position.world.y - 1,
      },
      // left
      {
        x: this.transform.position.world.x - 1,
        y: this.transform.position.world.y,
      },
      // right
      {
        x: this.transform.position.world.x + 1,
        y: this.transform.position.world.y,
      },
      // bottom
      {
        x: this.transform.position.world.x - 1,
        y: this.transform.position.world.y + 1,
      },
      {
        x: this.transform.position.world.x,
        y: this.transform.position.world.y + 1,
      },
      {
        x: this.transform.position.world.x + 1,
        y: this.transform.position.world.y + 1,
      },
    ]
  }

  get actionDirection(): Direction {
    const { x: mouseX, y: mouseY } = this.mouseTilePosition;
    const { x: playerX, y: playerY } = this.playerTilePosition;

    const x = mouseX - playerX;
    const y = mouseY - playerY;

    if (y === -1) {
      return Direction.Up;
    }

    if (y === 1) {
      return Direction.Down;
    }

    if (x < 0) {
      return Direction.Left;
    }

    if (x > 0) {
      return Direction.Right;
    }

    // default
    return Direction.Down;
  }

}
