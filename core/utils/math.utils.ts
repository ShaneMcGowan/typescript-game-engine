export abstract class MathUtils {
  // including min and max
  static randomIntFromRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // for adding a bit of randomness to animation start times
  static randomStartingDelta(seconds?: number): number {
    return Math.random() * (seconds ?? 1);
  }
}
