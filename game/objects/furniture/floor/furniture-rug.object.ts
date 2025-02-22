import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type FurnitureConfig } from '../furniture.object';
import { TilesetFurniture } from '@game/constants/tilesets/furniture.tileset';
import { FurnitureFloorObject } from '../furniture-floor.object';
import { type ItemTypeFurniture, ItemType } from '@game/models/inventory.model';

interface Config extends FurnitureConfig {

}

export class FurnitureRugObject extends FurnitureFloorObject {
  width = 2;
  height = 1;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get type(): ItemTypeFurniture {
    return ItemType.FurnitureRugLarge;
  }

  get sprite() {
    return {
      id: TilesetFurniture.id,
      config: TilesetFurniture.Rug.Blue.Large,
    };
  }
}
