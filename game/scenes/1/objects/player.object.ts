import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { Movement, MovementUtils } from '@core/utils/movement.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { type SAMPLE_SCENE_1 } from '@game/scenes/1.scene';
import { type ChestObject } from './chest.object';
import { DirtObject } from './dirt.object';
import { InventoryItemType, getInventoryItemClass } from '../models/inventory-item.model';
import { isInteractable } from '../models/interactable.model';
import { Input, MouseKey } from '@core/utils/input.utils';

enum Direction {
  UP = 'w',
  DOWN = 's',
  LEFT = 'a',
  RIGHT = 'd'
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

  controls = {
    [Direction.RIGHT]: false,
    [Direction.LEFT]: false,
    [Direction.UP]: false,
    [Direction.DOWN]: false,
    ['interact']: false,
    ['hotbar_left']: false,
    ['hotbar_right']: false,
    ['toggle_inventory']: false,
    ['dig']: false,
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

  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    super(scene, config);

    // store a reference to functions we are using in event listeners
    // key listeners references
    this.keyListeners.onMovementKeyDown = this.onMovementKeyDown.bind(this);
    this.keyListeners.onMovementKeyUp = this.onMovementKeyUp.bind(this);
    this.keyListeners.onOtherKeyDown = this.onOtherKeyDown.bind(this);
    this.keyListeners.onOtherKeyUp = this.onOtherKeyUp.bind(this);
    this.keyListeners.onInventoryKeyDown = this.onInventoryKeyDown.bind(this);
    this.keyListeners.onInventoryKeyUp = this.onInventoryKeyUp.bind(this);
    this.keyListeners.onInteractKeyDown = this.onInteractKeyDown.bind(this);
    this.keyListeners.onInteractKeyUp = this.onInteractKeyUp.bind(this);
    // event listener references
    this.eventListeners.onInventoryOpened = this.onInventoryOpened.bind(this);
    this.eventListeners.onInventoryClosed = this.onInventoryClosed.bind(this);
    this.eventListeners.onChestOpened = this.onChestOpened.bind(this);
    this.eventListeners.onChestClosed = this.onChestClosed.bind(this);
    this.eventListeners.onTextBoxOpen = this.onTextBoxOpen.bind(this);
    this.eventListeners.onTextBoxClose = this.onTextBoxClose.bind(this);

    // add control listeners
    this.enableMovementKeys();
    this.enableInteractKeys();
    this.enableInventoryKeys();
    this.enableOtherKeys();

    // add event listeners
    this.enableEventListeners();
  }

  private enableMovementKeys(): void {
    document.addEventListener('keydown', this.keyListeners.onMovementKeyDown);
    document.addEventListener('keyup', this.keyListeners.onMovementKeyUp);
  }

  private disableMovementKeys(): void {
    document.removeEventListener('keydown', this.keyListeners.onMovementKeyDown);
    document.removeEventListener('keyup', this.keyListeners.onMovementKeyUp);
    this.controls[Direction.RIGHT] = false;
    this.controls[Direction.LEFT] = false;
    this.controls[Direction.UP] = false;
    this.controls[Direction.DOWN] = false;
  }

  private enableOtherKeys(): void {
    document.addEventListener('keydown', this.keyListeners.onOtherKeyDown);
    document.addEventListener('keyup', this.keyListeners.onOtherKeyUp);
  }

  private disableOtherKeys(): void {
    document.removeEventListener('keydown', this.keyListeners.onOtherKeyDown);
    document.removeEventListener('keyup', this.keyListeners.onOtherKeyUp);
  }

  private enableInventoryKeys(): void {
    document.addEventListener('keydown', this.keyListeners.onInventoryKeyDown);
    document.addEventListener('keyup', this.keyListeners.onInventoryKeyUp);
  }

  private disableInventoryKeys(): void {
    document.removeEventListener('keydown', this.keyListeners.onInventoryKeyDown);
    document.removeEventListener('keyup', this.keyListeners.onInventoryKeyUp);
  }

  private enableInteractKeys(): void {
    document.addEventListener('keydown', this.keyListeners.onInteractKeyDown);
    document.addEventListener('keyup', this.keyListeners.onInteractKeyUp);
  }

  private disableInteractKeys(): void {
    document.removeEventListener('keydown', this.keyListeners.onInteractKeyDown);
    document.removeEventListener('keyup', this.keyListeners.onInteractKeyUp);
  }

  private enableEventListeners(): void {
    this.scene.addEventListener(this.scene.eventTypes.INVENTORY_OPENED, this.eventListeners.onInventoryOpened);
    this.scene.addEventListener(this.scene.eventTypes.INVENTORY_CLOSED, this.eventListeners.onInventoryClosed);
    this.scene.addEventListener(this.scene.eventTypes.CHEST_OPENED, this.eventListeners.onChestOpened);
    this.scene.addEventListener(this.scene.eventTypes.CHEST_CLOSED, this.eventListeners.onChestClosed);
    this.scene.addEventListener(this.scene.eventTypes.TEXTBOX_OPENED, this.eventListeners.onTextBoxOpen);
    this.scene.addEventListener(this.scene.eventTypes.TEXTBOX_CLOSED, this.eventListeners.onTextBoxClose);
  }

  private onInventoryOpened(event: CustomEvent): void {
    this.disableMovementKeys();
    this.disableInteractKeys();
    this.disableOtherKeys();
  }

  private onInventoryClosed(event: CustomEvent): void {
    this.enableMovementKeys();
    this.enableInteractKeys();
    this.enableOtherKeys();
  }

  private onChestOpened(event: CustomEvent): void {
    this.disableMovementKeys();
    this.disableInventoryKeys();
    this.disableOtherKeys();
  }

  private onChestClosed(event: CustomEvent): void {
    this.enableMovementKeys();
    this.enableInventoryKeys();
    this.enableOtherKeys();
  }

  private onTextBoxOpen(event: CustomEvent): void {
    this.disableAll();
  }

  private onTextBoxClose(event: CustomEvent): void {
    this.enableAll();
  }

  private disableAll(): void {
    this.disableMovementKeys();
    this.disableInteractKeys();
    this.disableInventoryKeys();
    this.disableOtherKeys();
  }

  private enableAll(): void {
    this.enableMovementKeys();
    this.enableInteractKeys();
    this.enableInventoryKeys();
    this.enableOtherKeys();
  }

  private onMovementKeyDown(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case Direction.RIGHT:
      case 'arrowright':
        this.controls[Direction.RIGHT] = true;
        break;
      case Direction.LEFT:
      case 'arrowleft':
        this.controls[Direction.LEFT] = true;
        break;
      case Direction.UP:
      case 'arrowup':
        this.controls[Direction.UP] = true;
        break;
      case Direction.DOWN:
      case 'arrowdown':
        this.controls[Direction.DOWN] = true;
        break;
    }
  }

  private onMovementKeyUp(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case Direction.RIGHT:
      case 'arrowright':
        this.controls[Direction.RIGHT] = false;
        break;
      case Direction.LEFT:
      case 'arrowleft':
        this.controls[Direction.LEFT] = false;
        break;
      case Direction.UP:
      case 'arrowup':
        this.controls[Direction.UP] = false;
        break;
      case Direction.DOWN:
      case 'arrowdown':
        this.controls[Direction.DOWN] = false;
        break;
    }
  }

  private onOtherKeyDown(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case 'l':
        this.controls['hotbar_left'] = true;
        break;
      case ';':
        this.controls['hotbar_right'] = true;
        break;
      case 'f':
        this.controls['dig'] = true;
        break;
    }
  }

  private onOtherKeyUp(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case 'l':
        this.controls['hotbar_left'] = false;
        break;
      case ';':
        this.controls['hotbar_right'] = false;
        break;
      case 'f':
        this.controls['dig'] = false;
        break;
    }
  }

  private onInventoryKeyDown(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case 'i':
        this.controls['toggle_inventory'] = true;
        break;
    }
  }

  private onInventoryKeyUp(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case 'i':
        this.controls['toggle_inventory'] = false;
        break;
    }
  }

  private onInteractKeyDown(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case ' ':
        this.controls['interact'] = true;
        break;
    }
  }

  private onInteractKeyUp(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case ' ':
        this.controls['interact'] = false;
        break;
    }
  }

  update(delta: number): void {
    this.updateMovement(delta);
    this.updateInteract();
    this.updatePickupObject();
    this.updateHotbar();
    this.updateToggleInventory();
    this.updateDig();
    this.updateClick();
  }

  render(context: CanvasRenderingContext2D): void {
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

  updateMovement(delta: number): void {
    this.determineNextMovement(delta);
    this.processAnimations(delta);
    this.processMovement(delta);
  }

  private determineNextMovement(delta: number): void {
    // check if we are moving
    if (this.targetX !== this.positionX || this.targetY !== this.positionY) {
      return;
    }

    // check if button pressed
    if (!this.controls[Direction.RIGHT] && !this.controls[Direction.LEFT] && !this.controls[Direction.UP] && !this.controls[Direction.DOWN]) {
      return;
    }

    let movement = new Movement(this.positionX, this.positionY, this.targetX, this.targetY);
    let direction;

    // determine next position and set direction
    if (this.controls[Direction.RIGHT]) {
      movement.targetX += 1;
      direction = Direction.RIGHT;
    } else if (this.controls[Direction.LEFT]) {
      movement.targetX -= 1;
      direction = Direction.LEFT;
    } else if (this.controls[Direction.UP]) {
      movement.targetY -= 1;
      direction = Direction.UP;
    } else if (this.controls[Direction.DOWN]) {
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

  private processAnimations(delta: number): void {
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

  private updateInteract(): void {
    if (!this.controls['interact']) {
      return;
    }

    let position = this.getPositionFacing();
    let object = this.scene.getObjectAtPosition(position.x, position.y, null);

    switch (true) {
      case object && isInteractable(object):
        object.interact();
        break;
      default:
        this.updateInteractDefault(position);
        break;
    }

    this.controls['interact'] = false;
  }

  private updateInteractChest(object: ChestObject): void {
    this.scene.dispatchEvent(this.scene.eventTypes.TOGGLE_CHEST, { object, });
  }

  private updateInteractDefault(position: { x: number; y: number; }): void {
    let index = this.scene.globals['hotbar_selected_index'];
    let item = this.scene.globals['inventory'][index];
    if (item === undefined) {
      return;
    }

    if (this.scene.hasOrWillHaveCollisionAtPosition(position.x, position.y)) {
      return;
    }

    if (item.type === InventoryItemType.Chicken || item.type === InventoryItemType.Egg) {
      let objectClass = getInventoryItemClass(item.type);
      let newObject: SceneObject = Reflect.construct(objectClass, [this.scene, { positionX: position.x, positionY: position.y, }]);
      this.scene.addObject(newObject);
      this.scene.removeFromInventory(index);
    }
  }

  // TODO(smg): logic here should be moved to individual object interactions using Interactable
  updatePickupObject(): void {

    /*
    // prevent picking up certain objects
    if (!isInventoryItem(object)) {
      return;
    }

    this.scene.removeObjectById(object.id);

    let type = getInventoryItemType(object);
    if (type !== undefined) {
      this.scene.addToInventory(type);
    }
    */
  }

  destroy(): void {
    // TODO(smg): what needs to be cleaned up here? are we sure the object is being properly released?
  }

  /**
   * TODO(smg): make 'Direction' a generic concept
   * TODO(smg): this needs to be rounded down
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
    if (this.controls['hotbar_left']) {
      this.controls['hotbar_left'] = false;
      this.scene.globals['hotbar_selected_index'] = (this.scene.globals['hotbar_selected_index'] - 1 + this.scene.globals['hotbar_size']) % this.scene.globals['hotbar_size'];
    }
    if (this.controls['hotbar_right']) {
      this.controls['hotbar_right'] = false;
      this.scene.globals['hotbar_selected_index'] = (this.scene.globals['hotbar_selected_index'] + 1) % this.scene.globals['hotbar_size'];
    }
  }

  private updateToggleInventory(): void {
    if (!this.controls['toggle_inventory']) {
      return;
    }

    this.scene.dispatchEvent(this.scene.eventTypes.TOGGLE_INVENTORY, {});

    this.controls['toggle_inventory'] = false;
  }

  private updateDig(): void {
    if (!this.controls['dig']) {
      return;
    }

    let position = this.getPositionFacing();
    let object = this.scene.getObjectAtPosition(position.x, position.y, null);
    if (object !== undefined) {
      return;
    }

    this.scene.addObject(new DirtObject(this.scene, { positionX: position.x, positionY: position.y, }));
    this.scene.dispatchEvent(this.scene.eventTypes.DIRT_PLACED, { x: position.x, y: position.y, });

    this.controls['dig'] = false;
  }

  private updateClick(): void {
    if (!Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    let x = Math.ceil(Input.mouse.position.x + this.scene.globals.camera.startX);
    let y = Math.ceil(Input.mouse.position.y + this.scene.globals.camera.startY);
    console.log('click', x, y);
  }
}
