import { SCENE_GAME } from "@game/scenes/game/scene";
import { FurnitureConfig } from "./furniture.object";
import { FurnitureWallObject } from "./furniture-wall.object";
import { MessageUtils } from "@game/utils/message.utils";
import { Interactable } from "@game/models/interactable.model";
import { ItemType, ItemTypeFurniture } from "@game/models/inventory.model";

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

  get type(): ItemTypeFurniture {
    return ItemType.FurniturePainting;
  }

  interact(): void {
    MessageUtils.showMessage(
      this.scene,
      `It's a painting of some lovely flowers.`
    )
  }

}