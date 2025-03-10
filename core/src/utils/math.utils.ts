export abstract class MathUtils {
  // including min and max
  static randomIntFromRange(min: number, max: number): number {
    return Math.floor(this.randomNumberFromRange(min, max));
  }

  static randomNumberFromRange(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
  }

  // for adding a bit of randomness to animation start times
  static randomStartingDelta(seconds?: number): number {
    return Math.random() * (seconds ?? 1);
  }

  static getRandomElement<T>(values: T[]): T | undefined {
    if (values.length === 0) {
      return undefined;
    }

    const index = this.randomIntFromRange(0, values.length - 1);

    return values[index];
  }

  /**
   * any value greater than 256 will be wrapped around to 0
   * @param value
   * @returns
   */
  static numberToHexString(value: number): string {
    value = value % 256;
    return value.toString(16);
  }

  static hexStringToNumber(value: string): number {
    return parseInt(value, 16);
  }
}
