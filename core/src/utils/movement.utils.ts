import { type Vector } from '@core/model/vector';
import { MathUtils } from './math.utils';

export class Movement {
  get position(): {
    x: number;
    y: number;
    // boundingBox: SceneObjectBoundingBox // TODO: should we add this in here?
  } {
    return {
      x: this.targetX,
      y: this.targetY,
    };
  }

  get target(): {
    x: number;
    y: number;
    // boundingBox: SceneObjectBoundingBox // TODO: should we add this in here?
  } {
    return {
      x: this.targetX,
      y: this.targetY,
    };
  }

  constructor(
    public positionX: number,
    public positionY: number,
    public targetX: number,
    public targetY: number
  ) {
    // this.position = {
    //   x: this.positionX,
    //   y: this.positionY,
    // }
    // this.target = {
    //   x: this.targetX,
    //   y: this.targetY,
    // }
  }
}
export abstract class MovementUtils {
  /**
   * will translate current position based on velocity, in a single direction with priority of right, left, down, up
   * @param movement
   * @param velocity
   */
  static moveTowardsPosition(movement: Movement, velocity: number): Movement {
    if (movement.targetX > movement.positionX) { // right
      movement.positionX += velocity;
      if (movement.targetX < movement.positionX) {
        movement.positionX = movement.targetX;
      }
    } else if (movement.targetX < movement.positionX) { // left
      movement.positionX -= velocity;
      if (movement.targetX > movement.positionX) {
        movement.positionX = movement.targetX;
      }
    } else if (movement.targetY > movement.positionY) { // down
      movement.positionY += velocity;
      if (movement.targetY < movement.positionY) {
        movement.positionY = movement.targetY;
      }
    } else if (movement.targetY < movement.positionY) { // up
      movement.positionY -= velocity;
      if (movement.targetY > movement.positionY) {
        movement.positionY = movement.targetY;
      }
    }

    return new Movement(
      movement.positionX,
      movement.positionY,
      movement.targetX,
      movement.targetY
    );
  }

  /**
   * Will translate current position 1 tile towards the target position, x-axis first, followed by y-axis
   * TODO: just straight up replace this with a DFS algorithm
   * @param currentMovement
   * @param targetMovement
   * @returns
   */
  static moveTowardsOtherEntity(currentMovement: Movement, targetMovement: { positionX: number; positionY: number; }): Movement {
    // TODO: add some randomness to this, potentially via MathUtils.randomIntFromRange(1, 4);

    if (targetMovement.positionX > currentMovement.positionX) {
      currentMovement.targetX += 1;
    } else if (targetMovement.positionX < currentMovement.positionX) {
      currentMovement.targetX -= 1;
    } else if (targetMovement.positionY > currentMovement.positionY) {
      currentMovement.targetY += 1;
    } else if (targetMovement.positionY < currentMovement.positionY) {
      currentMovement.targetY -= 1;
    }

    return new Movement(
      currentMovement.positionX,
      currentMovement.positionY,
      currentMovement.targetX,
      currentMovement.targetY
    );
  }

  static moveInRandomDirection(currentMovement: Movement): Movement {
    let randomValue = MathUtils.randomIntFromRange(1, 4);
    switch (randomValue) {
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
    );
  }

  /**
   * Returns the velocity for a given frame based off the delta provided
   * @param speed tiles per second
   * @param delta time since last frame
   * @returns
   */
  static frameSpeed(speed: number, delta: number): number {
    return speed * delta;
  }

  static MoveTowards(current: Vector, target: Vector, speed: number): Vector {
    // following object position relative to the current object
    let direction = target.subtract(current);
    // movement at desidered speed
    let movement = direction.normalized.multiply(speed);
    // ensure movement doesn't go passed the target

    if (movement.magnitude > direction.magnitude) {
      movement = direction;
    }

    return movement;
  }
}
