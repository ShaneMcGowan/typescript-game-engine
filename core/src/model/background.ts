interface Tile {
  x: number;
  y: number;
  sprite: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class Background {
  index: number;
  name: string;
  tileset: string;
  tiles: Map<string, Tile>;

  constructor(
    name: string,
    index: number,
    tileset: string,
  ) {
    this.name = name;
    this.index = index;
    this.tileset = tileset;
    this.tiles = new Map();
  }

  addTile(tile: Tile): void {
    this.tiles.set(
      this.getTileKey(tile),
      tile
    );
  }

  removeTile(tile: Tile): void {
    this.tiles.delete(
      this.getTileKey(tile)
    );
  }

  getTileKey(tile: Tile): string {
    return `${tile.x} , ${tile.y}`;
  }

  fromJson(json: string): void {
    const tiles: Tile[] = JSON.parse(json);
    tiles.forEach(tile => { this.addTile(tile); });
  }
}
