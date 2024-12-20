import { Tile } from "@game/models/tile.model";

export class TilesetBasic {

  static readonly id: string = 'tileset_basic';

  static readonly ArrowRight: Tile<'White', 'Default' | 'Pressed'> = {
    White: {
      Default: {
        x: 15, y: 0,
      },
      Pressed: {
        x: 16, y: 0,
      }
    }
  };

  static readonly ArrowLeft = {
    White: {
      Default: {
        x: 15, y: 1,
      },
      Pressed: {
        x: 16, y: 1,
      }
    }
  };

  static readonly ArrowUp = {
    White: {
      Default: {
        x: 15, y: 2,
      },
      Pressed: {
        x: 16, y: 2,
      }
    }
  };

  static readonly ArrowDown = {
    White: {
      Default: {
        x: 15, y: 3,
      },
      Pressed: {
        x: 16, y: 3,
      }
    }
  };

  static readonly CheckMark = {
    Green: {
      Default: {
        x: 15, y: 4,
      },
      Pressed: {
        x: 16, y: 4,
      }
    }
  };

  static readonly Cross = {
    Red: {
      Default: {
        x: 15,
        y: 5,
        width: 1,
        height: 1,
      },
      Pressed: {
        x: 16,
        y: 5,
        width: 1,
        height: 1,
      }
    }
  };

  static readonly Button: Tile<'White', 'Default' | 'Pressed'> = {
    White: {
      Default: {
        x: 3.5,
        y: 0.5,
        width: 2,
        height: 2,
      },
      Pressed: {
        x: 6.5,
        y: 0.5,
        width: 2,
        height: 2,
      }
    }
  };

  static readonly Skull: Tile<'Dark', 'Default'> = {
    Dark: {
      Default: {
        x: 55,
        y: 12,
        width: 1,
        height: 1,
      }
    }
  }
}