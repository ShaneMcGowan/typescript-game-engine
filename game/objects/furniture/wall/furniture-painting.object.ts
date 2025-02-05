import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type FurnitureConfig } from '../furniture.object';
import { FurnitureWallObject } from '../furniture-wall.object';
import { MessageUtils } from '@game/utils/message.utils';
import { type Interactable } from '@game/models/components/interactable.model';
import { ItemType, type ItemTypeFurniture } from '@game/models/inventory.model';

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
      'It\'s a painting of some lovely flowers.'
    );
  }
}
