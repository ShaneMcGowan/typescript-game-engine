import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";

enum Direction {
  UP = 'w',
  DOWN = 's',
  LEFT = 'a',
  RIGHT = 'd',
}

export class SampleObject implements SceneObject {
  
  controls = {
    [Direction.RIGHT]: false,
    [Direction.LEFT]: false,
    [Direction.UP]: false,
    [Direction.DOWN]: false,
  }

  animations = {
    [Direction.RIGHT]: [{ x: 1, y: 10 }, { x: 7, y: 10 }, { x: 10, y: 10 }],
    [Direction.LEFT]: [{ x: 1, y: 7 }, { x: 7, y: 7 }, { x: 10, y: 7}],
    [Direction.UP]: [{ x: 1, y: 4 }, { x: 7, y: 4 }, { x: 10, y: 4}],
    [Direction.DOWN]: [{ x: 1, y: 1 }, { x: 7, y: 1 }, { x: 10, y: 1 }],
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
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>
  ){
    document.addEventListener('keydown', (event) => {
      switch(event.key.toLocaleLowerCase()){
        case Direction.RIGHT:
          this.controls[Direction.RIGHT] = true;
          break;
        case Direction.LEFT:
          this.controls[Direction.LEFT] = true;
          break;
        case Direction.UP:
          this.controls[Direction.UP] = true;
          break;
        case Direction.DOWN:
          this.controls[Direction.DOWN] = true;
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch(event.key.toLocaleLowerCase()){
        case Direction.RIGHT:
          this.controls[Direction.RIGHT] = false;
          break;
        case Direction.LEFT:
          this.controls[Direction.LEFT] = false;
          break;
        case Direction.UP:
          this.controls[Direction.UP] = false;
          break;
        case Direction.DOWN:
          this.controls[Direction.DOWN] = false;
          break;
      }
    });
  }

  isRenderable: boolean;
  positionX = 1;
  positionY = 1;
  targetX = 1;
  targetY = 1;
  tileset = 'tileset_player';
  spriteX = 1;
  spriteY = 1;

  // constants
  speed = 4; // 4 tiles per second

  /**
   * // Animation based off time
    let animationIndex = 0;
    if (player.state.position.directionTime < .25) {
      animationIndex = 0;
    } else if (player.state.position.directionTime >= .25 && player.state.position.directionTime < .5) {
      animationIndex = 1;
    } else if (player.state.position.directionTime >= .5 && player.state.position.directionTime < .75) {
      animationIndex = 2;
    } else {
      animationIndex = 3;
    }
   * 
   * 
   * 
   * 
   *     // Move

   */

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

    if(this.targetX > this.positionX){ // right
      console.log('right');
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
      console.log('left');
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
      console.log('down');
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
      console.log('up');
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
    console.log({ target: this.targetX, position: this.positionX });
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

  destroy?(): void {
    // throw new Error("Method not implemented.");
  }

}