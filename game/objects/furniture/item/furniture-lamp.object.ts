import { SCENE_GAME } from "@game/scenes/game/scene";
import { FurnitureConfig } from "../furniture.object";
import { FurnitureItemObject } from "../furniture-item.object";
import { ItemType, ItemTypeFurniture } from "@game/models/inventory.model";
import { Interactable } from "@game/models/interactable.model";
import { MessageUtils } from "@game/utils/message.utils";

interface Config extends FurnitureConfig {

}

export class FurnitureLampObject extends FurnitureItemObject implements Interactable {

  width = 1;
  height = 1;

  active: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }
  
  get type(): ItemTypeFurniture {
    return ItemType.FurnitureLamp;
  }

  interact(): void {
    this.active = !this.active;

    MessageUtils.showMessage(
      this.scene,
      this.active ?  `I turn the light on.` : `I turn the light off.`
    );
  }

}