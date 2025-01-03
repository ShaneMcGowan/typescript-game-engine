import { Tile } from "@game/models/tile.model";

export class TilesetWoodenBridge {

  static readonly id: string = 'tileset_wood_bridge';

  static readonly Vertical: Tile<'Default', 'Top' | 'Middle' | 'Bottom'> = {
    Default: {
      Top: {
        x: 0,
        y: 0,
        height: 1,
        width: 1,
      },
      Middle: {
        x: 0,
        y: 1,
        height: 1,
        width: 1,
      },
      Bottom: {
        x: 0,
        y: 2,
        height: 1,
        width: 1,
      },
    }
  };

  static readonly Horizontal: Tile<'Default', 'Left' | 'Middle' | 'Right'> = {
    Default: {
      Left: {
        x: 2,
        y: 0,
        height: 1,
        width: 1,
      },
      Middle: {
        x: 3,
        y: 0,
        height: 1,
        width: 1,
      },
      Right: {
        x: 4,
        y: 0,
        height: 1,
        width: 1,
      },
    }
  };

}