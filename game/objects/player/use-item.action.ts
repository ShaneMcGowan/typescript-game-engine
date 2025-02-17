import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type PlayerObject } from '../player.object';
import { Inventory, ItemType } from '@game/models/inventory.model';
import { MessageUtils } from '@game/utils/message.utils';

export function useItem(scene: SCENE_GAME, player: PlayerObject, type: ItemType): void {
  switch (type) {
    case ItemType.Bread:
      MessageUtils.showMessage(scene, `You eat the ${Inventory.getItemName(type)}. Tasty.`);
      scene.globals.inventory.removeFromInventoryByIndex(scene.globals.hotbar_selected_index, 1);
      return;
    default:
      console.log(`Can't use this item`);
  }
}
