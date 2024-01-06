import { SampleObject } from "../scenes/sample/objects/player.object";
import { BackgroundLayer } from "./background-layer";
import { SceneObject } from "./scene-object";

export interface Scene {
  id: string;
  backgroundLayers: BackgroundLayer[];
  _objects: (typeof SampleObject)[]; // TODO(smg): should this be typeof any extends SceneObject, this is wrong for now anyway
  objects: SceneObject[];
  width: number; // width in tiles (e.g. 16 would be 16 tiles wide)
  height: number; // height in tiles
}