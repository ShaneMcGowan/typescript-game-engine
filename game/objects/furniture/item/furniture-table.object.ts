import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type FurnitureConfig } from '../furniture.object';
import { FurnitureItemObject } from '../furniture-item.object';
import { ItemType, type ItemTypeFurniture } from '@game/models/inventory.model';

interface Config extends FurnitureConfig {

}

export class FurnitureTableObject extends FurnitureItemObject {
  width = 1;
  height = 1;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get type(): ItemTypeFurniture {
    return ItemType.FurnitureTable;
  }
}
