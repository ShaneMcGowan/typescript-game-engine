import { ControlScheme, GamepadKey } from "@core/utils/input.utils";

export enum Control {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
  Inventory = 'Inventory',
  Interact = 'Interact',
  Action = 'Action',
  HotbarLeft = 'HotbarLeft',
  HotbarRight = 'HotbarRight',
}

export const CONTROL_SCHEME: ControlScheme<Control> = {
  [Control.Up]: {
    keyboard: ['w'],
    mouse: [],
    controller: [GamepadKey.DirectionUp]
  },
  [Control.Down]: {
    keyboard: ['s'],
    mouse: [],
    controller: [GamepadKey.DirectionDown]
  },
  [Control.Left]: {
    keyboard: ['a'],
    mouse: [],
    controller: [GamepadKey.DirectionLeft]
  },
  [Control.Right]: {
    keyboard: ['d'],
    mouse: [],
    controller: [GamepadKey.DirectionRight]
  },
  [Control.Inventory]: {
    keyboard: ['tab'],
    mouse: [],
    controller: [GamepadKey.OptionsRight]
  },
  [Control.Interact]: {
    keyboard: ['e', ' '],
    mouse: [],
    controller: [GamepadKey.ButtonDown]
  },
  [Control.Action]: {
    keyboard: [],
    mouse: [],
    controller: [GamepadKey.TriggerRight]
  },
  [Control.HotbarLeft]: {
    keyboard: [],
    mouse: [],
    controller: [GamepadKey.BumperLeft]
  },
  [Control.HotbarRight]: {
    keyboard: [],
    mouse: [],
    controller: [GamepadKey.BumperRight]
  }
} 