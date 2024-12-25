export enum MouseKey {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

export enum GamepadKey {
  ButtonDown = 0,
  ButtonRight = 1,
  ButtonLeft = 2,
  ButtonUp = 3,

  BumperLeft = 4,
  BumperRight = 5,

  TriggerLeft = 6,
  TriggerRight = 7,

  OptionsLeft = 8,
  OptionsRight = 9,

  StickLeft = 10,
  StickRight = 11,

  DirectionUp = 12,
  DirectionDown = 13,
  DirectionLeft = 14,
  DirectionRight = 15,

  Power = 16,
  Touchpad = 17
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
  };
  wheel: {
    event: WheelEvent;
  };
  latestEvent: MouseEvent;
}

export interface KeyBinding {
  keyboard: string[];
  controller: GamepadKey[];
  mouse: MouseKey[];
}

export type ControlScheme<T extends string> = Record<T, KeyBinding>;

export abstract class Input {
  private static readonly keyboard: Record<string, boolean> = {}; // TODO: add better typing for key

  static readonly mouse: Mouse = {
    click: {
      left: false,
      middle: false,
      right: false,
    },
    position: {
      x: 0,
      y: 0,
    },
    wheel: {
      event: new WheelEvent(''), // TODO: ensure this is a valid default event
      // deltaY negative is a scroll up
      // deltaY positive is a scroll down
    },
    latestEvent: new MouseEvent(''), // TODO: ensure this is a valid default event
  };

  static readonly gamepad = new Map<number, Gamepad>();

  static isKeyPressed(keys: string | string[]): boolean {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      if (this.keyboard[key]) {
        return true;
      }
    }

    return false;
  }

  static setKeyPressed(keys: string | string[]): void {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      this.keyboard[key] = true;
    }
  }

  static clearKeyPressed(keys: string | string[]): void {
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
