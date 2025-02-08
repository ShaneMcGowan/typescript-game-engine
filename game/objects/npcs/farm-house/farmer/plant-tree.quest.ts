import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Inventory, ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';

const BERRY_TARGET: number = 3;

export class QuestPlantTree extends Quest {
  id: QuestName = QuestName.plant_tree;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return {
      intro: `Now for your next task. Take this ${Inventory.getItemName(ItemType.Shovel)} and ${Inventory.getItemName(ItemType.Berry)}, head back up to the hill and plant a ${Inventory.getItemName(ItemType.Berry)} tree in the dirt patch. As for the other 3 ${Inventory.getItemName(ItemType.Berry, true)} you gave me, I ate them. They were tasty. Yum. Once you have planted the tree, you will need to wait for the ${Inventory.getItemName(ItemType.Berry, true)} to grow, try having a sleep in one of the beds to pass the time.`,
      failure: `Head up to the hill and plant a ${Inventory.getItemName(ItemType.Berry)} tree, then come back here and have a sleep in the bed to pass the time until the ${Inventory.getItemName(ItemType.Berry, true)} grow. Bring me back ${BERRY_TARGET} ${Inventory.getItemName(ItemType.Berry)}.`,
      success: `You did it, now we can have all the ${Inventory.getItemName(ItemType.Berry, true)} we want! Unless you chop down all the trees and eat all the ${Inventory.getItemName(ItemType.Berry, true)}, but that would just be silly to do.`,
    };
  }

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Shovel);
    this.scene.globals.inventory.addToInventory(ItemType.Berry);
  }

  check(): boolean {
    return this.checkAndRemoveItem(ItemType.Berry, BERRY_TARGET);
  }
}
