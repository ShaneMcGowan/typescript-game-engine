import { SCENE_GAME } from "@game/scenes/game/scene";
import { FurnitureObject, FurnitureConfig } from "./furniture.object";

interface Config extends FurnitureConfig {

}

export class FurnitureFloorObject extends FurnitureObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    console.log(this.renderer.layer);
    this.renderer.layer--;
    this.collision.enabled = false;
  }

}