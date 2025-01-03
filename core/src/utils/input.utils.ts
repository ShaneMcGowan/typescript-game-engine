import { type Coordinate } from '@core/model/coordinate';
import { Vector } from '@core/model/vector';

export enum MouseKey {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

export enum GamepadKey {
  ButtonBottom = 0,
  ButtonRight = 1,
  ButtonLeft = 2,
  ButtonTop = 3,

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
  Touchpad = 17 // TODO: what does this refer to on non PS5 controllers?
}

interface Mouse {
  click: {
    left: boolean;
    middle: boolean;
    right: boolean;
    details: {
      event: MouseEvent;
      position: Coordinate;
    }; // set on pointerdown, cleared on pointerup
  };
  position: {
    x: number;
    y: number;
  };
  wheel: {
    event: WheelEvent;
  };
}

class GamepadButtonState {
  pressed: boolean = false;
  cleared: boolean = false;

  updateState(pressed: boolean): void {
    // button is not pressed, reset state
    if (!pressed) {
      this.pressed = false;
      this.cleared = false;
      return;
    }

    // if not manually cleared
    if (!this.cleared) {
      this.pressed = true;
    }
  }

  clearState(): void {
    // only set cleared if button was previously pressed
    // not having this check causes issues when running `Input.clearPressed` without the button having been previously pressed
    if (!this.pressed) {
      return;
    }

    this.pressed = false;
    this.cleared = true;
  }
}

class ClientGamepad {
  connected: boolean = false;
  buttons: Map<GamepadKey, GamepadButtonState> = new Map<GamepadKey, GamepadButtonState>();
  leftStick: Vector = new Vector(0, 0);
  rightStick: Vector = new Vector(0, 0);

  constructor() {
    Object.values(GamepadKey).forEach(value => this.buttons.set(value as GamepadKey, new GamepadButtonState())); // TODO: is this typing valid
  }
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
      details: null,
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
  };

  static readonly gamepads = new Map<number, Gamepad>();
  static readonly gamepad: ClientGamepad = new ClientGamepad();

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

  static isMousePressed(keys: MouseKey | MouseKey[] = MouseKey.Left): boolean {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      if (this.mouse.click[key]) {
        return true;
      };
    }

    return false;
  }

  static clearMousePressed(keys: MouseKey | MouseKey[] = MouseKey.Left): void {
    if (!Array.isArray(keys)) {
      keys = [keys];
    }

    for (const key of keys) {
      this.mouse.click[key] = false;
    }
  }

  static isButtonPressed(buttons: GamepadKey | GamepadKey[]): boolean {
    if (!Array.isArray(buttons)) {
      buttons = [buttons];
    }

    for (const button of buttons) {
      const b = this.gamepad.buttons.get(button);
      if (b.pressed && !b.cleared) {
        return true;
      }
    }

    return false;
  }

  static clearButtonPressed(buttons: GamepadKey | GamepadKey[]): void {
    if (!Array.isArray(buttons)) {
      buttons = [buttons];
    }

    for (const button of buttons) {
      this.gamepad.buttons.get(button).clearState();
    }
  }

  static isPressed<T extends string>(scheme: ControlScheme<T>, controls: T | T[]): boolean {
    if (!Array.isArray(controls)) {
      controls = [controls];
    }

    for (const control of controls) {
      // keyboard
      if (this.isKeyPressed(scheme[control].keyboard)) {
        return true;
      }

      // mouse
      if (this.isMousePressed(scheme[control].mouse)) {
        return true;
      }

      // controller
      if (this.isButtonPressed(scheme[control].controller)) {
        return true;
      }
    }

    return false;
  }

  static clearPressed<T extends string>(scheme: ControlScheme<T>, controls: T | T[]): void {
    if (!Array.isArray(controls)) {
      controls = [controls];
    }

    for (const control of controls) {
      // keyboard
      this.clearKeyPressed(scheme[control].keyboard);

      // mouse
      this.clearMousePressed(scheme[control].mouse);

      // controller
      this.clearButtonPressed(scheme[control].controller);
    }
  }
}
