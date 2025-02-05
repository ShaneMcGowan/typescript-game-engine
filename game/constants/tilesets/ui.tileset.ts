import { type Tile } from '@game/models/tile.model';

export class TilesetUI {
  static readonly id: string = 'tileset_ui';

  static readonly Container: Tile<'White' | 'Default' | 'Dark' | 'Darker', 'Default'> = {
    White: {
      Default: {
        x: 0.5,
        y: 1.5,
        width: 2,
        height: 2,
      },
    },
    Default: {
      Default: {
        x: 0.5,
        y: 3.5,
        width: 2,
        height: 2,
      },
    },
    Dark: {
      Default: {
        x: 0.5,
        y: 6.5,
        width: 2,
        height: 2,
      },
    },
    Darker: {
      Default: {
        x: 0.5,
        y: 9.5,
        width: 2,
        height: 2,
      },
    },
  };

  static readonly Selector: Tile<'White', 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight'> = {
    White: {
      TopLeft: {
        x: 9,
        y: 9,
        width: 1,
        height: 1,
      },
      TopRight: {
        x: 10,
        y: 9,
        width: 1,
        height: 1,
      },
      BottomLeft: {
        x: 9,
        y: 10,
        width: 1,
        height: 1,
      },
      BottomRight: {
        x: 10,
        y: 10,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly PortraitContainer: Tile<'Darker', 'TopLeft' | 'Top' | 'TopRight' | 'Left' | 'Centre' | 'Right' | 'BottomLeft' | 'Bottom' | 'BottomRight'> = {
    Darker: {
      TopLeft: {
        x: 12,
        y: 6,
        width: 1,
        height: 1,
      },
      Top: {
        x: 13,
        y: 6,
        width: 1,
        height: 1,
      },
      TopRight: {
        x: 14,
        y: 6,
        width: 1,
        height: 1,
      },

      Left: {
        x: 12,
        y: 7,
        width: 1,
        height: 1,
      },
      Centre: {
        x: 13,
        y: 7,
        width: 1,
        height: 1,
      },
      Right: {
        x: 14,
        y: 7,
        width: 1,
        height: 1,
      },

      BottomLeft: {
        x: 12,
        y: 8,
        width: 1,
        height: 1,
      },
      Bottom: {
        x: 13,
        y: 8,
        width: 1,
        height: 1,
      },
      BottomRight: {
        x: 14,
        y: 8,
        width: 1,
        height: 1,
      },
    },
  };
}
