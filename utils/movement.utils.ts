import { MathUtils } from "./math.utils";

export class Movement {

  constructor(
    public positionX: number,
    public positionY: number, 
    public targetX: number,
    public targetY: number
  ){ }

}
export class MovementUtils {

  /**
   * will translate current position based on velocity, in a single direction with priority of right, left, down, up
   * @param movement 
   * @param velocity 
   */
  static moveTowardsPosition(movement: Movement, velocity: number): Movement {
     if(movement.targetX > movement.positionX){ // right
      movement.positionX += velocity;
      if(movement.targetX < movement.positionX){
        movement.positionX = movement.targetX;
      }
    }
    
    if(movement.targetX < movement.positionX){ // left
      movement.positionX -= velocity;
      if(movement.targetX > movement.positionX){
        movement.positionX = movement.targetX;
      }
    }
    
    if(movement.targetY > movement.positionY){ // down
      movement.positionY += velocity;
      if(movement.targetY < movement.positionY){
        movement.positionY = movement.targetY;
      }
    }
    
    if(movement.targetY < movement.positionY){ // up
      movement.positionY -= velocity;
      if(movement.targetY > movement.positionY){
        movement.positionY = movement.targetY;
      }
    }

    return new Movement(
      movement.positionX,
      movement.positionY,
      movement.targetX,
      movement.targetY
    )
  }

  /**
   * Will translate current position 1 tile towards the target position, x-axis first, followed by y-axis
   * @param currentMovement 
   * @param targetMovement 
   * @returns 
   */
  static moveTowardsOtherEntity(currentMovement: Movement, targetMovement: Movement): Movement{
    // TODO(smg): add some randomness to this, potentially via MathUtils.randomIntFromRange(1, 4);
    let movement = new Movement(0,0,0,0);
    
    if(targetMovement.positionX > currentMovement.positionX){
      currentMovement.targetX += 1;
    } else if (targetMovement.positionX < currentMovement.positionX){
      currentMovement.targetX -= 1;
    } else if (targetMovement.positionY > currentMovement.positionY){
      currentMovement.targetY += 1;
    } else if (targetMovement.positionY < currentMovement.positionY){
      currentMovement.targetY -= 1;
    }

    return new Movement(
      currentMovement.positionX,
      currentMovement.positionY,
      currentMovement.targetX,
      currentMovement.targetY
    )
  }

  static moveInRandomDirection(currentMovement: Movement): Movement{
    let randomValue = MathUtils.randomIntFromRange(1, 4);
    switch(randomValue){
      case 1:
        currentMovement.targetX += 1;
        break;
      case 2:
        currentMovement.targetX -= 1;
        break;
      case 3:
        currentMovement.targetY += 1;
        break;
      case 4:
        currentMovement.targetY -= 1;
        break;
    }
    
    return new Movement(
      currentMovement.positionX,
      currentMovement.positionY,
      currentMovement.targetX,
      currentMovement.targetY
    )
  }

  /**
   * Returns the velocity for a given frame based off the delta provided
   * @param speed tiles per second
   * @param delta time since last frame
   * @returns 
   */
  static frameVelocity(speed: number, delta: number){
    return speed * delta;
  }

}