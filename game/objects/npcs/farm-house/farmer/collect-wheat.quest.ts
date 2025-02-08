import { type SCENE_GAME } from '@game/scenes/game/scene';
import { ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';

export class QuestCollectWheat extends Quest {
  id: QuestName = QuestName.collect_wheat;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return {
      intro: `Hi, I don't think we've met. I'm the Farmer. If you're looking for something to do, go collect some Wheat for me. Collect 9 Wheat for me and I'll give you the key to the gate out front.`,
      failure: `Collect 9 Wheat for me and I'll give you the key to the gate out front, then I'll have more for you to do.`,
      success: `Thanks! I really wasn't feeling up to collecting Wheat today, good thing you showed up. Here is the key to the gate out front. Come back to me for more to do once you're done exploring.`,
    };
  }

  onSuccess(): void {
    // give key
    this.scene.globals.inventory.addToInventory(ItemType.GateKey);
  }

  check(): boolean {
    return this.checkAndRemoveItem(ItemType.Wheat, 9);
  }
}
