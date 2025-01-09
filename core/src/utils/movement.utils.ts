import { type Vector } from '@core/model/vector';
import { MathUtils } from './math.utils';
import { type SceneObject } from '@core/model/scene-object';
import { type Coordinate } from '@core/model/coordinate';

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
    public x: number,
    public y: number,
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
    if (movement.targetX > movement.x) { // right
      movement.x += velocity;
      if (movement.targetX < movement.x) {
        movement.x = movement.targetX;
      }
    } else if (movement.targetX < movement.x) { // left
      movement.x -= velocity;
      if (movement.targetX > movement.x) {
        movement.x = movement.targetX;
      }
    } else if (movement.targetY > movement.y) { // down
      movement.y += velocity;
      if (movement.targetY < movement.y) {
        movement.y = movement.targetY;
      }
    } else if (movement.targetY < movement.y) { // up
      movement.y -= velocity;
      if (movement.targetY > movement.y) {
        movement.y = movement.targetY;
      }
    }

    return new Movement(
      movement.x,
      movement.y,
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
  static moveTowardsOtherEntity(currentMovement: Movement, targetMovement: { x: number; y: number; }): Movement {
    // TODO: add some randomness to this, potentially via MathUtils.randomIntFromRange(1, 4);

    if (targetMovement.x > currentMovement.x) {
      currentMovement.targetX += 1;
    } else if (targetMovement.x < currentMovement.x) {
      currentMovement.targetX -= 1;
    } else if (targetMovement.y > currentMovement.y) {
      currentMovement.targetY += 1;
    } else if (targetMovement.y < currentMovement.y) {
      currentMovement.targetY -= 1;
    }

    return new Movement(
      currentMovement.x,
      currentMovement.y,
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
      currentMovement.x,
      currentMovement.y,
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

  static RelativePosition(objectA: SceneObject, objectB: SceneObject, max?: number): Coordinate {
    let x = objectB.transform.position.world.x - objectA.transform.position.world.x;
    let y = objectB.transform.position.world.y - objectA.transform.position.world.y;

    if (max) {
      if (x > 0) {
        x = Math.min(x, max);
      } else if (x < 0) {
        x = Math.min(x, max * -1);
      }

      if (y > 0) {
        y = Math.min(y, max);
      } else if (y < 0) {
        y = Math.min(y, max * -1);
      }
    }

    return {
      x,
      y,
    };
  }
}
