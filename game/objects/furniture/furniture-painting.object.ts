import { SCENE_GAME } from "@game/scenes/game/scene";
import { FurnitureConfig } from "./furniture.object";
import { TilesetFurniture } from "@game/constants/tilesets/furniture.tileset";
import { FurnitureWallObject } from "./furniture-wall.object";
import { MessageUtils } from "@game/utils/message.utils";
import { Interactable } from "@game/models/interactable.model";

interface Config extends FurnitureConfig {

}

export class FurniturePaintingObject extends FurnitureWallObject implements Interactable {
  
  width = 1;
  height = 1;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get sprite() {
    return {
      id: TilesetFurniture.id,
      config: TilesetFurniture.Painting.Flowers.Default,
    }
  }

  interact(): void {
    MessageUtils.showMessage(
      this.scene,
      `It's a painting of some lovely flowers.`
    )
  }

}