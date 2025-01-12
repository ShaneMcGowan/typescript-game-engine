import { SCENE_GAME } from "@game/scenes/game/scene";
import { FurnitureConfig } from "../furniture.object";
import { FurnitureItemObject } from "../furniture-item.object";
import { Interactable } from "@game/models/components/interactable.model";
import { MessageUtils } from "@game/utils/message.utils";
import { ItemType, ItemTypeFurniture } from "@game/models/inventory.model";

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
  
  get type(): ItemTypeFurniture {
    return ItemType.FurnitureBed;
  }
  
  interact(): void {
    MessageUtils.showMessage(
      this.scene,
      `The bed looks really comfy.`
    )
  }

}