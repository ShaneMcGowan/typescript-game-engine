export enum MouseKey {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

interface Mouse {
  click: {
    left: boolean;
    middle: boolean;
    right: boolean;
  };
  position: {
    x: number;
    y: number;
    exactX: number; // not rounded to tile
    exactY: number; // not rounded to tile
  };
  lastestEvent: MouseEvent;
}

export abstract class Input {

  private static readonly keyboard: Record<string, boolean> = {} // TODO: add better typing for key
  static readonly mouse: Mouse = {
    click: {
      left: false,
      middle: false,
      right: false
    },
    position: {
      x: 0,
      y: 0,
      exactX: 0,
      exactY: 0,
    },
    lastestEvent: new MouseEvent('') // TODO: ensure this is valid
  }

  static isKeyPressed(keys: string | string[]) {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      if (this.keyboard[key] === true) {
        return true;
      }
    }

    return false;
  }

  static setKeyPressed(keys: string | string[]) {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      this.keyboard[key] = true;
    }
  }

  static clearKeyPressed(keys: string | string[]) {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      this.keyboard[key] = false;
    }
  }

  static isMousePressed(mouseKey: MouseKey = MouseKey.Left): boolean {
    return this.mouse.click[mouseKey];
  }

  static clearMousePressed(mouseKey: MouseKey = MouseKey.Left): void {
    this.mouse.click[mouseKey] = false;
  }
}