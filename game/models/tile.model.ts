export interface TileConfig {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export type Tile<Colour extends string, Variant extends string> = Record<Colour, Record<Variant, TileConfig>>;
