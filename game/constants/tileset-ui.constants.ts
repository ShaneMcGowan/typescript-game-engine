import { Tile } from "@game/models/tile.model";

export class TilesetUI {

  static readonly id: string = 'tileset_ui';

  static readonly Container: Tile<'White' | 'Default' | 'Dark' | 'Darker', 'Default'> = { 
    White: {
      Default: {
        x: 0.5, 
        y: 1.5,
        width: 2,
        height: 2
      },
    },
    Default: {
      Default: {
        x: 0.5, 
        y: 3.5,
        width: 2,
        height: 2
      },
    },
    Dark: {
      Default: {
        x: 0.5, 
        y: 6.5,
        width: 2,
        height: 2
      },
    },
    Darker: {
      Default: {
        x: 0.5, 
        y: 9.5,
        width: 2,
        height: 2
      },
    }
  };

}