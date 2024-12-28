import { Tile } from "@game/models/tile.model";

export class TilesetGrassBiome {

  static readonly id: string = 'tileset_grass_biome';

  static readonly Rock: Tile<'Default', 'Dry' | 'Wet'> = { 
    Default: {
      Dry: {
        x: 8, 
        y: 1,
        width: 1,
        height: 1
      },
      Wet: {
        x: 5, 
        y: 4,
        width: 1,
        height: 1
      },
    },
  };

  static readonly SmallTree: Tile<'Default', 'Default'> = { 
    Default: {
      Default: {
        x: 0, 
        y: 0,
        width: 1,
        height: 2
      },
    },
  };

}