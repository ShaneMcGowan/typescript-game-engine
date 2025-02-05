import { type ControlScheme, GamepadKey, MouseKey } from '@core/utils/input.utils';

export enum Control {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
  OpenInventory = 'OpenInventory',
  CloseInventory = 'CloseInventory',
  CloseShop = 'CloseShop',
  Interact = 'Interact',
  Action = 'Action',
  HotbarLeft = 'HotbarLeft',
  HotbarRight = 'HotbarRight',
  Confirm = 'Confirm'
}

export const CONTROL_SCHEME: ControlScheme<Control> = {
  [Control.Up]: {
    keyboard: ['w'],
    mouse: [],
    controller: [GamepadKey.DirectionUp],
  },
  [Control.Down]: {
    keyboard: ['s'],
    mouse: [],
    controller: [GamepadKey.DirectionDown],
  },
  [Control.Left]: {
    keyboard: ['a'],
    mouse: [],
    controller: [GamepadKey.DirectionLeft],
  },
  [Control.Right]: {
    keyboard: ['d'],
    mouse: [],
    controller: [GamepadKey.DirectionRight],
  },
  [Control.OpenInventory]: {
    keyboard: ['tab'],
    mouse: [],
    controller: [GamepadKey.Touchpad],
  },
  [Control.CloseInventory]: {
    keyboard: ['tab'],
    mouse: [],
    controller: [GamepadKey.Touchpad, GamepadKey.ButtonRight],
  },
  [Control.CloseShop]: {
    keyboard: ['tab'],
    mouse: [],
    controller: [GamepadKey.ButtonRight],
  },
  [Control.Interact]: {
    keyboard: ['e', ' '],
    mouse: [],
    controller: [GamepadKey.ButtonBottom],
  },
  [Control.Action]: {
    keyboard: [],
    mouse: [MouseKey.Left],
    controller: [GamepadKey.TriggerRight],
  },
  [Control.HotbarLeft]: {
    keyboard: [],
    mouse: [],
    controller: [GamepadKey.BumperLeft],
  },
  [Control.HotbarRight]: {
    keyboard: [],
    mouse: [],
    controller: [GamepadKey.BumperRight],
  },
  [Control.Confirm]: {
    keyboard: ['e', ' '],
    mouse: [MouseKey.Left],
    controller: [GamepadKey.ButtonBottom],
  },
};
