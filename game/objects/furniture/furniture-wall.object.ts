import { SCENE_GAME } from "@game/scenes/game/scene";
import { FurnitureObject, FurnitureConfig } from "./furniture.object";

interface Config extends FurnitureConfig {

}

export class FurnitureWallObject extends FurnitureObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

}