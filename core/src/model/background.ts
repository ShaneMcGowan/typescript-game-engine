export interface Tile {
  x: number;
  y: number;
  sprite: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class Map {
  name: string;
  width: number;
  height: number;
  layers: Background[];

  constructor(name: string, width: number, height: number) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.layers = [];
  }

  addLayer(name: string, index: number, tileset: string): Background {
    const layer = new Background(
      this,
      name,
      index,
      tileset
    );

    this.layers.push(layer);

    return layer;
  }

  removeLayer(background: Background): void {
    this.layers = this.layers.filter(layer => layer !== background);
  }
}

export class Background {
  index: number;
  name: string;
  tileset: string;
  tiles: Tile[][]; // [y][x]

  constructor(
    map: Map,
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
    }
  }

  addTile(tile: Tile): void {
    this.tiles[tile.y][tile.x] = tile;
  }

  removeTile(tile: Tile): void {
    this.tiles[tile.y][tile.x] = undefined;
  }

  getTileKey(tile: Tile): string {
    return `${tile.x} , ${tile.y}`;
  }

  fromJson(json: string): void {
    const tiles: Tile[] = JSON.parse(json);
    tiles.forEach(tile => { this.addTile(tile); });
  }
}
