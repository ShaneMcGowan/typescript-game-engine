import { type Vector } from '@core/model/vector';
import { MathUtils } from './math.utils';
import { type SceneObject } from '@core/model/scene-object';
import { type Coordinate } from '@core/model/coordinate';

export class Movement {
  get position(): {
    x: number;
    y: number;
  } {
    return {
      x: this.x,
      y: this.y,
    };
  }

  get target(): {
    x: number;
    y: number;
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
  static MoveTowardsPosition(current: Coordinate, target: Coordinate, velocity: number): Coordinate {
    if (target.x > current.x) { // right
      current.x += velocity;
      if (target.x < current.x) {
        current.x = target.x;
      }
    } else if (target.x < current.x) { // left
      current.x -= velocity;
      if (target.x > current.x) {
        current.x = target.x;
      }
    } else if (target.y > current.y) { // down
      current.y += velocity;
      if (target.y < current.y) {
        current.y = target.y;
      }
    } else if (target.y < current.y) { // up
      current.y -= velocity;
      if (target.y > current.y) {
        current.y = target.y;
      }
    }

    return {
      x: current.x,
      y: current.y,
    };
  }

  /**
   * Will translate current position 1 tile towards the target position, x-axis first, followed by y-axis
   * TODO: just straight up replace this with a DFS algorithm
   * @param currentMovement
   * @param targetMovement
   * @returns
   */
  static MoveTowardsTarget(currentPosition: Coordinate, targetPosition: Coordinate): Movement {
    let x = 0;
    let y = 0;

    if (targetPosition.x > currentPosition.x) {
      x = 1;
    } else if (targetPosition.x < currentPosition.x) {
      x = -1;
    } else if (targetPosition.y > currentPosition.y) {
      y = 1;
    } else if (targetPosition.y < currentPosition.y) {
      y = -1;
    }

    return new Movement(
      currentPosition.x,
      currentPosition.y,
      currentPosition.x + x,
      currentPosition.y + y
    );
  }

  /**
   * Move in a random direction
   * @param coordinate
   * @returns
   */
  static MoveInRandomDirection(coordinate: Coordinate, magnitude: number = 1): Movement {
    const random = MathUtils.randomIntFromRange(1, 4);

    let x = 0;
    let y = 0;

    switch (random) {
      case 1:
        x = magnitude;
        break;
      case 2:
        x = -magnitude;
        break;
      case 3:
        y = magnitude;
        break;
      case 4:
        y = -magnitude;
        break;
    }

    return new Movement(
      coordinate.x,
      coordinate.y,
      coordinate.x + x,
      coordinate.y + y
    );
  }

  /**
   * Returns the velocity for a given frame based off the delta provided
   * @param speed tiles per second
   * @param delta time since last frame
   * @returns
   */
  static FrameSpeed(speed: number, delta: number): number {
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
