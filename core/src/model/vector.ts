export class Vector {
  constructor(
    public x: number,
    public y: number
  ) { }

  get flooredX(): number {
    return Math.floor(this.x);
  }

  get flooredY(): number {
    return Math.floor(this.y);
  }

  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get normalized(): Vector {
    let length = this.magnitude;

    // if magnitude of vector is zero then return a Zero Vector (0,0)
    // otherwise we will get NaN as we cannot divide by 0
    if (length === 0) {
      return new Vector(0, 0);
    }

    return new Vector(
      this.x / length,
      this.y / length
    );
  }

  /**
   * radians relative to X Axis
   */
  get radians(): number {
    // note: atan2 Returns the angle (in radians) between the X axis and the line going through both the origin and the given point.
    return Math.atan2(this.y, this.x);
  }

  /**
   * degrees relative to X Axis
   */
  get degrees(): number {
    return this.radians * 180 / Math.PI;
  }

  add(vector: Vector): Vector {
    return new Vector(
      this.x + vector.x,
      this.y + vector.y
    );
  }

  subtract(vector: Vector): Vector {
    return new Vector(
      this.x - vector.x,
      this.y - vector.y
    );
  }

  multiply(speed: number): Vector {
    return new Vector(
      this.x * speed,
      this.y * speed
    );
  }

  divide(speed: number): Vector {
    return new Vector(
      this.x / speed,
      this.y / speed
    );
  }


}
