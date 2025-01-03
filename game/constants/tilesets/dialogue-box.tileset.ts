import { Tile } from "@game/models/tile.model";

export class TilesetDialogueBox {

  static readonly id: string = 'tileset_dialogue_box';

  static readonly TopLeft: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 0, 
        y: 0,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly Top: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 0.5, 
        y: 0,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly TopRight: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 1, 
        y: 0,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly Left: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 0, 
        y: 0.5,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly Centre: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 2, 
        y: 0,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly Right: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 1, 
        y: 0.5,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly BottomLeft: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 0, 
        y: 1,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly Bottom: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 0.5, 
        y: 1,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly BottomRight: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 1, 
        y: 1,
        width: 1,
        height: 1,
      },
    }
  };

  static readonly Notch: Tile<'Default', 'Default'> = {
    Default: {
      Default: {
        x: 2, 
        y: 1,
        width: 1,
        height: 1,
      },
    }
  };
}