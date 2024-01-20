import { type Scene } from '@model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { Movement, MovementUtils } from '@utils/movement.utils';
import { RenderUtils } from '@utils/render.utils';
import { FenceObject, FenceType } from './fence.object';
import { CameraObject } from '../maps/0/objects/camera.object';

enum Direction {
  UP = 'w',
  DOWN = 's',
  LEFT = 'a',
  RIGHT = 'd'
}

const TILE_SET = 'tileset_player';

interface Config extends SceneObjectBaseConfig {
}

export class PlayerObject extends SceneObject {
  isRenderable = true;
  hasCollision = true;

  // constants
  movementSpeed = 4; // 4 tiles per second

  controls = {
    [Direction.RIGHT]: false,
    [Direction.LEFT]: false,
    [Direction.UP]: false,
    [Direction.DOWN]: false,
    ['remove_fence']: false,
    ['place_fence']: false,
    ['toggle_follow']: false,
    ['place_object']: false,
    ['pick_up_object']: false,
    ['hotbar_left']: false,
    ['hotbar_right']: false,
    ['toggle_inventory']: false,
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
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);

    // store a reference to functions we are using in event listeners
    // key listeners references
    this.keyListeners.onMovementKeyDown = this.onMovementKeyDown.bind(this);
    this.keyListeners.onMovementKeyUp = this.onMovementKeyUp.bind(this);
    this.keyListeners.onControlKeyDown = this.onControlKeyDown.bind(this);
    this.keyListeners.onControlKeyUp = this.onControlKeyUp.bind(this);
    // event listener references
    this.eventListeners.onInventoryOpened = this.onInventoryOpened.bind(this);
    this.eventListeners.onInventoryClosed = this.onInventoryClosed.bind(this);

    // add control listeners
    this.enableMovementKeys();
    this.enableControlKeys();

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
  }

  private enableControlKeys(): void {
    document.addEventListener('keydown', this.keyListeners.onControlKeyDown);
    document.addEventListener('keyup', this.keyListeners.onControlKeyUp);
  }

  private disableControlKeys(): void {
    document.removeEventListener('keydown', this.keyListeners.onControlKeyDown);
    document.removeEventListener('keyup', this.keyListeners.onControlKeyUp);
  }

  private enableEventListeners(): void {
    this.scene.addEventListener(this.scene.eventTypes.INVENTORY_OPENED, this.eventListeners.onInventoryOpened);
    this.scene.addEventListener(this.scene.eventTypes.INVENTORY_CLOSED, this.eventListeners.onInventoryClosed);
  }

  private onInventoryOpened(event: CustomEvent): void {
    this.disableMovementKeys();
  }

  private onInventoryClosed(event: CustomEvent): void {
    this.enableMovementKeys();
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

  private onControlKeyDown(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case 'j':
        this.controls.remove_fence = true;
        break;
      case 'k':
        this.controls.place_fence = true;
        break;
      case ' ':
        this.controls.toggle_follow = true;
        break;
      case 'e':
        this.controls['place_object'] = true;
        break;
      case 'q':
        this.controls['pick_up_object'] = true;
        break;
      case 'l':
        this.controls['hotbar_left'] = true;
        break;
      case ';':
        this.controls['hotbar_right'] = true;
        break;
      case 'i':
        this.controls['toggle_inventory'] = true;
        break;
    }
  }

  private onControlKeyUp(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case 'j':
        this.controls.remove_fence = false;
        break;
      case 'k':
        this.controls.place_fence = false;
        break;
      case ' ':
        this.controls.toggle_follow = false;
        break;
      case 'e':
        this.controls['place_object'] = false;
        break;
      case 'q':
        this.controls['pick_up_object'] = false;
        break;
      case 'l':
        this.controls['hotbar_left'] = false;
        break;
      case ';':
        this.controls['hotbar_right'] = false;
        break;
      case 'i':
        this.controls['toggle_inventory'] = false;
        break;
    }
  }

  update(delta: number): void {
    this.updateMovement(delta);
    this.updateRemoveFence();
    this.updatePlaceFence();
    this.updateToggleFollow();
    this.updatePlaceObject();
    this.updatePickupObject();
    this.updateHotbar();
    this.updateToggleInventory();
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

  updateRemoveFence(): void {
    if (!this.controls.remove_fence) {
      return;
    }

    let position = this.getPositionFacing();
    let object = this.scene.getObjectAtPosition(position.x, position.y, null);

    if (object instanceof FenceObject) {
      this.scene.removeObject(object);
    }

    this.controls.remove_fence = false;
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

  updatePlaceFence(): void {
    if (!this.controls['place_fence']) {
      return;
    }

    let position = this.getPositionFacing();
    if (this.scene.hasOrWillHaveCollisionAtPosition(position.x, position.y)) {
      return;
    }

    let fence = new FenceObject(
      this.scene,
      {
        positionX: position.x,
        positionY: position.y,
        type: FenceType.FencePost,
      }
    );
    this.scene.addObject(fence);

    this.controls['place_fence'] = false;
  }

  updateToggleFollow(): void {
    if (!this.controls.toggle_follow) {
      return;
    }

    this.scene.globals.chickens_follow_player = !this.scene.globals.chickens_follow_player;

    this.controls.toggle_follow = false;
  }

  updatePlaceObject(): void {
    if (!this.controls['place_object']) {
      return;
    }

    if (this.scene.globals['inventory'].length === 0) {
      return;
    }

    let position = this.getPositionFacing();
    if (this.scene.hasOrWillHaveCollisionAtPosition(position.x, position.y)) {
      return;
    }

    let objectClass = this.scene.globals['inventory'][this.scene.globals['inventory'].length - 1];
    let object: SceneObject = Reflect.construct(objectClass, [this.scene, { positionX: position.x, positionY: position.y, }]);
    this.scene.addObject(object);

    this.controls['place_object'] = false;
    this.scene.globals['inventory'].pop();
  }

  updatePickupObject(): void {
    if (!this.controls['pick_up_object']) {
      return;
    }

    if (this.scene.globals['inventory'].length === this.scene.globals['inventory_size']) {
      return;
    }

    let position = this.getPositionFacing();

    // TODO(smg): see how getObjectAtPosition works with rendering layers etc
    let object = this.scene.getObjectAtPosition(position.x, position.y, null);
    if (object === undefined) {
      return;
    }

    // prevent placing
    switch (true) {
      case object instanceof CameraObject:
        return;
      default:
        break;
    }

    this.scene.removeObject(object);

    this.controls['pick_up_object'] = false;
    this.scene.globals['inventory'].push(object.constructor);
  }

  destroy(): void {
    // TODO(smg): what needs to be cleaned up here? are we sure the object is being properly released?
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
    if (this.controls['hotbar_left']) {
      this.controls['hotbar_left'] = false;
      this.scene.globals['hotbar_selected_index'] = (this.scene.globals['hotbar_selected_index'] - 1 + this.scene.globals['hotbar_size']) % this.scene.globals['hotbar_size'];
    } else if (this.controls['hotbar_right']) {
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
}
