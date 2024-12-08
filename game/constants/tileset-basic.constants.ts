type TileConfig = {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

type Tile = Record<string, Record<string, TileConfig>>;

export class TilesetBasic {
  static ArrowRight = { 
    White: {
      Default: {
        x: 15, y: 0,
      },
      Pressed: {
        x: 16, y: 0,
      }
    }
   };

   static ArrowLeft = { 
    White: {
      Default: {
        x: 15, y: 1,
      },
      Pressed: {
        x: 16, y: 1,
      }
    }
   };

  static ArrowUp = { 
    White: {
      Default: {
        x: 15, y: 2,
      },
      Pressed: {
        x: 16, y: 2,
      }
    }
  };

  static ArrowDown = { 
    White: {
      Default: {
        x: 15, y: 3,
      },
      Pressed: {
        x: 16, y: 3,
      }
    }
  };

  static CheckMark = { 
    Green: {
      Default: {
        x: 15, y: 4,
      },
      Pressed: {
        x: 16, y: 4,
      }
    }
  };

  static Cross = { 
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

  static Button: Tile = { 
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
}