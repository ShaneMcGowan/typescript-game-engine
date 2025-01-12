import { SCENE_GAME } from "@game/scenes/game/scene";
import { FurnitureConfig } from "./furniture.object";
import { TilesetFurniture } from "@game/constants/tilesets/furniture.tileset";
import { FurnitureItemObject } from "./furniture-item.object";
import { Interactable } from "@game/models/interactable.model";
import { MessageUtils } from "@game/utils/message.utils";

interface Config extends FurnitureConfig {

}

export class FurnitureBedObject extends FurnitureItemObject implements Interactable {

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
      config: TilesetFurniture.Bed.Blue.Default,
    }
  }
  
  interact(): void {
    MessageUtils.showMessage(
      this.scene,
      `The bed looks really comfy.`
    )
  }

}