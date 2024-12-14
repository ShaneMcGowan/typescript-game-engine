import { Tile } from "@game/models/tile.model";

export class TilesetHouse {

  static readonly id: string = 'tileset_house';

  static readonly Door: Tile<'Default', 'Open' | 'Closed' | 'AlmostClosed' | 'AlmostOpen'> = { 
    Default: {
      Open: {
        x: 3, 
        y: 0,
        width: 1,
        height: 1
      },
      Closed: {
        x: 3, 
        y: 1,
        width: 1,
        height: 1
      },
      AlmostOpen: {
        x: 3, 
        y: 2,
        width: 1,
        height: 1
      },
      AlmostClosed: {
        x: 3, 
        y: 3,
        width: 1,
        height: 1
      },
    },
  };


  static readonly Wall: Tile<'Default', 'BottomLeft' | 'Bottom' | 'BottomRight'> = { 
    Default: {
      BottomLeft: {
        x: 0.5, 
        y: 3,
        width: 1,
        height: 1
      },
      Bottom: {
        x: 1, 
        y: 3,
        width: 1,
        height: 1
      },
      BottomRight: {
        x: 1.5, 
        y: 3,
        width: 1,
        height: 1
      }
    },
  };

  static readonly Roof: Tile<'Default', 'BottomLeft' | 'Bottom' | 'BottomRight'> = { 
    Default: {
      BottomLeft: {
        x: 4.5, 
        y: 3.5,
        width: 1,
        height: 1
      },
      Bottom: {
        x: 5, 
        y: 3.5,
        width: 1,
        height: 1
      },
      BottomRight: {
        x: 5.5, 
        y: 3.5,
        width: 1,
        height: 1
      }
    },
  };

}