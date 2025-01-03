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

  static readonly Tree: Tile<'Default', 'Default'> = { 
    Default: {
      Default: {
        x: 1, 
        y: 0,
        width: 2,
        height: 2
      },
    },
  };

  static readonly Fruit: Tile<'Berry', 'OnTree' | 'OnGround'> = {
    Berry: {
      OnTree: {
        x: 0, 
        y: 2,
        width: 1,
        height: 1
      },
      OnGround: {
        x: 1, 
        y: 2,
        width: 1,
        height: 1
      }
    }
  }

  static readonly Stump: Tile<'Default', 'Big' | 'Small'> = { 
    Default: {
      Big: {
        x: 4, 
        y: 2,
        width: 1,
        height: 1
      },
      Small: {
        x: 3, 
        y: 2,
        width: 1,
        height: 1
      },
    },
  };

}