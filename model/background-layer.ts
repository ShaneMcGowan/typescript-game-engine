import { BackgroundTile2 } from "./background-tile";

export interface BackgroundLayer {
  index: number; // the order in which the layer is rendered
  tiles: BackgroundTile2[][]; // a 2D array of tiles, this allows for more efficient rendering
}