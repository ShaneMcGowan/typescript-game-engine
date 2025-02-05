import { type Tile } from '@game/models/tile.model';

type Colour = 'Blue'; // | 'Green' | 'Red'; we will add more in full game

export class TilesetFurniture {
  static readonly id: string = 'tileset_furniture';

  static readonly Bed: Tile<Colour, 'Default'> = {
    Blue: {
      Default: {
        x: 1,
        y: 1.5,
        width: 1,
        height: 1.5,
      },
    },
  };

  static readonly Painting: Tile<'Flowers', 'Default'> = {
    Flowers: {
      Default: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly Rug: Tile<'Blue', 'Large'> = {
    Blue: {
      Large: {
        x: 7,
        y: 5,
        width: 2,
        height: 1,
      },
    },
  };

  static readonly Table: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 3,
        y: 3,
        width: 1,
        height: 1,
      },
    },
  };

  static readonly Lamp: Tile<Colour, 'Default'> = {
    Blue: {
      Default: {
        x: 4,
        y: 1,
        width: 1,
        height: 1,
      },
    },
  };
}
