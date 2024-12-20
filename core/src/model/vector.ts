export class Vector {
  constructor(
    public x: number,
    public y: number
  ) { }

  get roundedX(): number {
    return Math.floor(this.x);
  }

  get roundedY(): number {
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
