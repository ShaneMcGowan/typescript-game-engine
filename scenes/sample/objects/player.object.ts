import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { MathUtils } from "../../../utils/math.utils";
import { RenderUtils } from "../../../utils/render.utils";
import { ChickenObject } from "./chicken.object";
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
  positionX = 7;
  positionY = 3;
  targetX = 7;
  targetY = 3;
  tileset = 'tileset_player';
  spriteX = 1;
  spriteY = 1;

  // constants
  speed = 4; // 4 tiles per second

  controls = {
    [Direction.RIGHT]: false,
    [Direction.LEFT]: false,
    [Direction.UP]: false,
    [Direction.DOWN]: false,
    ['remove_fence']: false,
    ['place_fence']: false,
  }

  animations = {
    [Direction.RIGHT]: [{ x: 7, y: 10 }, { x: 10, y: 10 }, { x: 1, y: 10 }],
    [Direction.LEFT]: [{ x: 7, y: 7 }, { x: 10, y: 7}, { x: 1, y: 7 }],
    [Direction.UP]: [{ x: 7, y: 4 }, { x: 10, y: 4}, { x: 1, y: 4 }],
    [Direction.DOWN]: [{ x: 7, y: 1 }, { x: 10, y: 1 }, { x: 1, y: 1 }],
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
  directionFrames: number = 0;
  animationIndex: number = 0;
  isIdle: boolean = true;

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { positionX?: number, positionY?: number, targetX?: number, targetY?: number },
  ){

    this.positionX = this.config.positionX ?? 5;
    this.targetX = this.config.targetX ?? this.positionX;
    this.positionY = this.config.positionY ?? 5;
    this.targetY = this.config.targetY ?? this.positionY;

    document.addEventListener('keydown', (event) => {
      console.log(event);
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
      }
    });
  }

  update(delta: number): void {
    const velocity = this.speed * delta
    
    // update target position and direction based on controls, if we are no longer moving
    if(this.targetX === this.positionX && this.targetY === this.positionY) {
      let direction;
      if(this.controls[Direction.RIGHT]){
        this.targetX += 1;
        direction = Direction.RIGHT;
      } else if(this.controls[Direction.LEFT]){
        this.targetX -= 1;
        direction = Direction.LEFT;
      } else if(this.controls[Direction.UP]){
        this.targetY -= 1;
        direction = Direction.UP;
      } else if(this.controls[Direction.DOWN]){
        this.targetY += 1;
        direction = Direction.DOWN;
      }

      if(direction){
        this.direction = direction;
        this.directionTime = 0;
      }

      this.isIdle = true;
    } else {
      this.isIdle = false;
    }

    // update animation based on direction and time spent moving in direction
    if(this.isIdle){
      // idle
      if (this.directionTime < .5) {
        this.animationIndex = 0;
      } else {
        this.animationIndex = 1;
      } 
    } else {
      // moving
      if (this.directionTime < .333) {
        this.animationIndex = 0;
      } else if (this.directionTime < .666){
        this.animationIndex = 1;
      } else {
        this.animationIndex = 2;
      }
    }

    /*
    if (this.directionTime < .25) {
      this.animationIndex = 0;
    } else if (this.directionTime >= .25 && this.directionTime < .5) {
      this.animationIndex = 1;
    } else if (this.directionTime >= .5 && this.directionTime < .75) {
      this.animationIndex = 2;
    } else {
      this.animationIndex = 3;
    }
    */

    this.directionTime = (this.directionTime + delta) % 1;

    // update player position

    // check if can move to position
    if(this.scene.hasCollisionAtPosition(this.targetX, this.targetY)){
      this.targetX = Math.floor(this.positionX);
      this.targetY = Math.floor(this.positionY);
    }

    if(this.targetX > this.positionX){ // right
      this.positionX += velocity;
      this.direction = Direction.RIGHT;

      // snap to position
      if(this.targetX < this.positionX){
        this.positionX = this.targetX;

        if(this.controls[Direction.RIGHT]){
          this.targetX += 1;
        }
      }
    } else if(this.targetX < this.positionX){ // left
      this.positionX -= velocity;
      this.direction = Direction.LEFT;

      // snap to position
      if(this.targetX > this.positionX){
        this.positionX = this.targetX;

        if(this.controls[Direction.LEFT]){
          this.targetX -= 1;
          this.direction = Direction.LEFT;
        } 
      }
    } else if(this.targetY > this.positionY){ // down
      this.positionY += velocity;
      this.direction = Direction.DOWN;
      
      // snap to position
      if(this.targetY < this.positionY){
        this.positionY = this.targetY;

        if(this.controls[Direction.DOWN]){
          this.targetY += 1;
          this.direction = Direction.DOWN;
        }
      }
    } else if(this.targetY < this.positionY){ // up
      this.positionY -= velocity;
      this.direction = Direction.UP;

      // snap to position
      if(this.targetY > this.positionY){
        this.positionY = this.targetY;

        if(this.controls[Direction.UP]){
          this.targetY -= 1;
          this.direction = Direction.UP;
        }
      }
    }

    this.updateRemoveFence();
    this.updatePlaceFence();
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

  updatePlaceFence(): void {
     if(this.controls['place_fence'] === false){
      return;
    }

    let position = this.getPositionFacing();
    let object = this.scene.getObjectAtPosition(position.x, position.y, null);
    if(object){
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

  destroy?(): void {
    // throw new Error("Method not implemented.");
  }

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