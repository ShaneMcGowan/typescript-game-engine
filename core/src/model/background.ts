export interface JsonBackgroundMap {
  name: string;
  width: number;
  height: number;
  layers: JsonBackgroundMapLayer[];
}

export interface JsonBackgroundMapLayer {
  index: number;
  name: string;
  tileset: string;
  tiles: Array<Array<JsonBackgroundMapTile | null>>; // [y][x]
}

export interface JsonBackgroundMapTile {
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

  /**
   * Creating a new layer
   * @param name
   * @param index
   * @param tileset
   * @returns
   */
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

  // copyLayer(layer: EditorLayer): EditorLayer {
  // const layer = new EditorLayer(
  //   this,
  //   name,
  //   index,
  //   tileset
  // );
  // }

  /**
   * Remove a layer
   * @param background
   */
  removeLayer(background: EditorLayer): void {
    this.layers = this.layers.filter(layer => layer !== background);
  }

  toJson(): string {
    const data: JsonBackgroundMap = {
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

  /**
   * import from Json
   * @param json
   * @returns
   */
  static fromJson(json: string): EditorMap {
    const data: JsonBackgroundMap = JSON.parse(json);

    const map = new EditorMap(
      data.name,
      data.width,
      data.height
    );

    map.layers = data.layers
      .map(layer => EditorLayer.fromJson(map, layer))
      .sort((a, b) => a.index - b.index);

    return map;
  }
}

export class EditorLayer {
  index: number;
  name: string;
  tileset: string;
  tiles: Array<Array<JsonBackgroundMapTile | null>>; // [y][x]

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

  addTile(tile: JsonBackgroundMapTile): void {
    this.tiles[tile.y][tile.x] = tile;
  }

  removeTile(tile: JsonBackgroundMapTile): void {
    this.tiles[tile.y][tile.x] = undefined;
  }

  getTileKey(tile: JsonBackgroundMapTile): string {
    return `${tile.x} , ${tile.y}`;
  }

  /**
   * import from Json
   * @param map
   * @param data
   * @returns
   */
  static fromJson(map: EditorMap, data: JsonBackgroundMapLayer): EditorLayer {
    const layer = new EditorLayer(
      map,
      data.name,
      data.index,
      data.tileset
    );

    layer.tiles = data.tiles;

    return layer;
  }
}
