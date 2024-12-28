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

}