import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { Movement, MovementUtils } from "../../../utils/movement.utils";
import { RenderUtils } from "../../../utils/render.utils";
import { EggObject } from "./egg.object";
import { FenceObject, FenceType } from "./fence.object";

enum Direction {
  UP = 'w',
  DOWN = 's',
  LEFT = 'a',
  RIGHT = 'd',
}

export class PlayerObject implements SceneObject {
  
  isRenderable: boolean;
  hasCollision = true;
  positionX;
  positionY;
  targetX;
  targetY;
  tileset = 'tileset_player';
  spriteX = 1;
  spriteY = 1;

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
    ['place_egg']: false,
    ['change_map']: false,
  }

  animations = {
    [Direction.RIGHT]: [{ x: 7, y: 10 }, { x: 10, y: 10 }],
    [Direction.LEFT]: [{ x: 7, y: 7 }, { x: 10, y: 7}],
    [Direction.UP]: [{ x: 7, y: 4 }, { x: 10, y: 4}],
    [Direction.DOWN]: [{ x: 7, y: 1 }, { x: 10, y: 1 }],
  }

  animationsIdle = {
    [Direction.RIGHT]: [{ x: 1, y: 10 }, { x: 4, y: 10 }],
    [Direction.LEFT]: [{ x: 1, y: 7 }, { x: 4, y: 7 }],
    [Direction.UP]: [{ x: 1, y: 4 }, { x: 4, y: 4 }],
    [Direction.DOWN]: [{ x: 1, y: 1 }, { x: 4, y: 1 }],
  }

  // direction state
  direction: Direction = Direction.DOWN;
  directionTime: number = 0;
  directionTimer: number = 0;
  animationIndex: number = 0;
  isIdle: boolean = true;

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { positionX?: number, positionY?: number, targetX?: number, targetY?: number },
  ){
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.config.targetX ?? this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.config.targetY ?? this.positionY;

    document.addEventListener('keydown', (event) => {
      switch(event.key.toLocaleLowerCase()){
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
        case 'j':
          this.controls['remove_fence'] = true;
          break;
        case 'k':
          this.controls['place_fence'] = true;
          break;
        case ' ':
          this.controls['toggle_follow'] = true;
          break;
        case 'e':
          this.controls['place_egg'] = true;
          break;
        case 'm':
            this.controls['change_map'] = true;
            break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch(event.key.toLocaleLowerCase()){
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
        case 'j':
          this.controls['remove_fence'] = false;
          break;
        case 'k':
          this.controls['place_fence'] = false;
          break;
        case ' ':
          this.controls['toggle_follow'] = false;
          break;
        case 'e':
          this.controls['place_egg'] = false;
          break;
        case 'm':
          this.controls['change_map'] = false;
          break;
      }
    });
  }

  update(delta: number): void {
    this.updateMovement(delta);
    this.updateRemoveFence();
    this.updatePlaceFence();
    this.updateToggleFollow();
    this.updateEgg();
    this.updateChangeMap();
  }

  render(): void {
    let animations = this.isIdle ? this.animationsIdle : this.animations;
    RenderUtils.renderSprite(
      this.context,
      this.assets.images[this.tileset],
      animations[this.direction][this.animationIndex].x, // sprite x
      animations[this.direction][this.animationIndex].y, // sprite y
      this.positionX,
      this.positionY
    );
  }

  updateRemoveFence(): void {
    if(this.controls['remove_fence'] === false){
      return;
    }

    let position = this.getPositionFacing();
    let object = this.scene.getObjectAtPosition(position.x, position.y, null);

    if(object instanceof FenceObject){
      this.scene.removeObject(object);
    }

    this.controls['remove_fence'] = false;
  }

  updateMovement(delta: number): void {
    this.determineNextMovement(delta);
    this.processAnimations(delta);
    this.processMovement(delta);
  }

  private determineNextMovement(delta: number): void {

    // check if we are moving
    if(this.targetX !== this.positionX || this.targetY !== this.positionY) {
      return;
    }

    // check if button pressed
    if(!this.controls[Direction.RIGHT] && !this.controls[Direction.LEFT] && !this.controls[Direction.UP] && !this.controls[Direction.DOWN]){
      return;
    }

    let movement = new Movement(this.positionX, this.positionY, this.targetX, this.targetY);
    let direction;

    // determine next position and set direction
    if(this.controls[Direction.RIGHT]){
      movement.targetX += 1;
      direction = Direction.RIGHT;
    } else if(this.controls[Direction.LEFT]){
      movement.targetX -= 1;
      direction = Direction.LEFT;
    } else if(this.controls[Direction.UP]){
      movement.targetY -= 1;
      direction = Direction.UP;
    } else if(this.controls[Direction.DOWN]){
      movement.targetY += 1;
      direction = Direction.DOWN;
    }

    // update direction regardless of movement
    // reset animations if new direction
    if(this.direction !== direction){
      this.direction = direction;
      this.directionTime = 0;
      this.directionTimer = 0;
    } else {
      this.directionTimer += delta;
    }

    // if direction has not been held for 5 frames, do not move
    if(this.directionTimer < .05){
      return;
    }
    
    // check if can move to position
    if(this.scene.hasCollisionAtPosition(movement.targetX, movement.targetY)){
      return;
    }
    if(this.scene.willHaveCollisionAtPosition(movement.targetX, movement.targetY)){
      return;
    }
    if(this.scene.isOutOfBounds(movement.targetX, movement.targetY)){
      return;
    }

    this.targetX = movement.targetX;
    this.targetY = movement.targetY;
  }

  private processAnimations(delta: number): void {
    if(this.targetX !== this.positionX || this.targetY !== this.positionY){
      this.isIdle = false;
    } else {
      this.isIdle = true;
    }

    if(this.isIdle){
      // idle
      if (this.directionTime < .5) {
        this.animationIndex = 0;
      } else {
        this.animationIndex = 1;
      } 
    } else {
      if (this.directionTime < .25) {
        this.animationIndex = 0;
      } else if (this.directionTime < .5) {
        this.animationIndex = 1;
      } else if (this.directionTime < .75){
        this.animationIndex = 0;
      } else {
        this.animationIndex = 1;
      }
    }

    this.directionTime = (this.directionTime + delta) % 1;
  }

  private processMovement(delta: number): void {
    if(this.targetX !== this.positionX || this.targetY !== this.positionY){
      let movement = new Movement(this.positionX, this.positionY, this.targetX, this.targetY);
      let updatedMovement = MovementUtils.moveTowardsPosition(movement, MovementUtils.frameVelocity(this.movementSpeed, delta));
      
      this.positionX = updatedMovement.positionX; 
      this.positionY = updatedMovement.positionY;
    }
  }

  updatePlaceFence(): void {
     if(this.controls['place_fence'] === false){
      return;
    }

    let position = this.getPositionFacing();
    if(this.scene.hasOrWillHaveCollisionAtPosition(position.x, position.y)){
      return;
    }

    let fence = new FenceObject(
      this.scene, 
      this.context, 
      this.assets,
      {
        positionX: Math.floor(position.x),
        positionY: Math.floor(position.y),
        type: FenceType.FencePost
      },
    );
    this.scene.addObject(fence);

    this.controls['place_fence'] = false;
  }

  updateToggleFollow(): void {
    if(this.controls['toggle_follow'] === false){
      return;
    }

    this.scene.globals['chickens_follow_player'] = !this.scene.globals['chickens_follow_player'];

    this.controls['toggle_follow'] = false;
  }

  updateEgg(): void {
    if(this.controls['place_egg'] === false){
      return;
    }

    let position = this.getPositionFacing();
    if(this.scene.hasOrWillHaveCollisionAtPosition(position.x, position.y)){
      return;
    }

    let egg = new EggObject(
      this.scene, 
      this.context, 
      this.assets,
      {
        positionX: Math.floor(position.x),
        positionY: Math.floor(position.y),
      },
    );
    this.scene.addObject(egg);

    this.controls['place_egg'] = false;
  }

  updateChangeMap(): void {
    if(this.controls['change_map'] === false){
      return;
    }

    this.scene.loadNewMap(1);

    this.controls['change_map'] = false;
  }

  destroy(): void {
    // TODO(smg): what needs to be cleaned up here? are we sure the object is being properly released?  
  }

  /**
   * TODO: make 'Direction' a generic concept
   * TODO: this needs to be rounded down
   * @returns 
   */
  getPositionFacing(): { x: number, y: number } {
    if(this.direction === Direction.RIGHT){
      return { x: this.positionX + 1, y: this.positionY };
    } else if(this.direction === Direction.LEFT){
      return { x: this.positionX - 1, y: this.positionY };
    } else if(this.direction === Direction.UP){
      return { x: this.positionX, y: this.positionY - 1 };
    } else if (this.direction === Direction.DOWN){
      return { x: this.positionX, y: this.positionY + 1 };
    }
  }

}