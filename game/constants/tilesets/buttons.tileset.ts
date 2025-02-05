import { type Tile } from '@game/models/tile.model';

export class TilesetButtons {
  static readonly id: string = 'tileset_button';

  static readonly TopLeft: Tile<'Default', 'Default' | 'Hover' | 'Pressed'> = {
    Default: {
      Default: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
      Pressed: {
        x: 6,
        y: 0,
        width: 1,
        height: 1,
      },
      Hover: {
        x: 12,
        y: 0,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly Top: Tile<'Default', 'Default' | 'Hover' | 'Pressed'> = {
    Default: {
      Default: {
        x: 1,
        y: 0,
        width: 1,
        height: 1,
      },
      Pressed: {
        x: 7,
        y: 0,
        width: 1,
        height: 1,
      },
      Hover: {
        x: 13,
        y: 0,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly TopRight: Tile<'Default', 'Default' | 'Hover' | 'Pressed'> = {
    Default: {
      Default: {
        x: 5,
        y: 0,
        width: 1,
        height: 1,
      },
      Pressed: {
        x: 11,
        y: 0,
        width: 1,
        height: 1,
      },
      Hover: {
        x: 17,
        y: 0,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly BottomLeft: Tile<'Default', 'Default' | 'Hover' | 'Pressed'> = {
    Default: {
      Default: {
        x: 0,
        y: 1,
        width: 1,
        height: 1,
      },
      Pressed: {
        x: 6,
        y: 1,
        width: 1,
        height: 1,
      },
      Hover: {
        x: 12,
        y: 1,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly Bottom: Tile<'Default', 'Default' | 'Hover' | 'Pressed'> = {
    Default: {
      Default: {
        x: 1,
        y: 1,
        width: 1,
        height: 1,
      },
      Pressed: {
        x: 7,
        y: 1,
        width: 1,
        height: 1,
      },
      Hover: {
        x: 13,
        y: 1,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly BottomRight: Tile<'Default', 'Default' | 'Hover' | 'Pressed'> = {
    Default: {
      Default: {
        x: 5,
        y: 1,
        width: 1,
        height: 1,
      },
      Pressed: {
        x: 11,
        y: 1,
        width: 1,
        height: 1,
      },
      Hover: {
        x: 17,
        y: 1,
        width: 1,
        height: 1,
      },
    },
  };
}
