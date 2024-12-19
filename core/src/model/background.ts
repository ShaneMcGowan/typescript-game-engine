export interface JsonEditorMap {
  name: string;
  width: number;
  height: number;
  layers: JsonEditorLayer[];
}

export interface JsonEditorLayer {
  index: number;
  name: string;
  tileset: string;
  tiles: Array<Array<JsonEditorTile | null>>; // [y][x]
}

export interface JsonEditorTile {
  x: number;
  y: number;
  sprite: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class EditorMap {
  name: string;
  width: number;
  height: number;
  layers: EditorLayer[];

  constructor(name: string, width: number, height: number) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.layers = [];
  }

  addLayer(name: string, index: number, tileset: string): EditorLayer {
    const layer = new EditorLayer(
      this,
      name,
      index,
      tileset
    );

    this.layers.push(layer);

    return layer;
  }

  removeLayer(background: EditorLayer): void {
    this.layers = this.layers.filter(layer => layer !== background);
  }

  toJson(): string {
    const data: JsonEditorMap = {
      name: this.name,
      width: this.width,
      height: this.height,
      layers: this.layers.map(layer => {
        return {
          index: layer.index,
          name: layer.name,
          tileset: layer.tileset,
          tiles: layer.tiles,
        };
      }).sort((a, b) => a.index - b.index),
    };

    return JSON.stringify(data);
  }

  static fromJson(): EditorMap {
    return new EditorMap(
      'TODO',
      0,
      0
    );
  }
}

export class EditorLayer {
  index: number;
  name: string;
  tileset: string;
  tiles: Array<Array<JsonEditorTile | null>>; // [y][x]

  constructor(
    map: EditorMap,
    name: string,
    index: number,
    tileset: string
  ) {
    this.name = name;
    this.index = index;
    this.tileset = tileset;
    this.tiles = [];

    // populate tiles
    for (let col = 0; col < map.height; col++) {
      this.tiles[col] = [];
      for (let row = 0; row < map.width; row++) {
        this.tiles[col][row] = null; // using null over undefined for easier mapping back and forth via Json
      }
    }
  }

  addTile(tile: JsonEditorTile): void {
    this.tiles[tile.y][tile.x] = tile;
  }

  removeTile(tile: JsonEditorTile): void {
    this.tiles[tile.y][tile.x] = undefined;
  }

  getTileKey(tile: JsonEditorTile): string {
    return `${tile.x} , ${tile.y}`;
  }
}
