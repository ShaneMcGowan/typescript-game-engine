import { type SCENE_GAME, StoryFlag } from '@game/scenes/game/scene';
import { Inventory, ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';

const QUEST_NAME: QuestName = QuestName.collect_berries;

const BERRY_TARGET: number = 3;

export class QuestCollectBerries extends Quest {
  id: QuestName = QUEST_NAME;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return {
      intro: `Next we need to find some ${Inventory.getItemName(ItemType.Berry, true).toLocaleLowerCase()}. There should be some ${Inventory.getItemName(ItemType.Berry, true).toLocaleLowerCase()} up on the hill beside us. The gate to the hill is locked so take this ${Inventory.getItemName(ItemType.GateKey)}. Bring me back 4 ${Inventory.getItemName(ItemType.Berry, true).toLocaleLowerCase()}. I think I also left my ${Inventory.getItemName(ItemType.WateringCan)} somewhere around there. Try find that too.`,
      failure: `Head up the the hill and bring me back ${BERRY_TARGET} ${Inventory.getItemName(ItemType.Berry, true).toLocaleLowerCase()} and the ${Inventory.getItemName(ItemType.WateringCan)}.`,
      success: `Fantastic, I've been looking for that ${Inventory.getItemName(ItemType.WateringCan)} for ages. Did you lock the gate again after you left? I don't want people wandering around up there stealing my berries.`,
    };
  }

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.GateKey);
    this.scene.setStoryFlag(StoryFlag.world_collect_berries_started, true);
  }

  onSuccess(): void {
    this.scene.setStoryFlag(StoryFlag.world_collect_berries_completed, true);
  }

  check(): boolean {
    // watering can
    if (!this.checkItem(ItemType.WateringCan, 1)) {
      return false;
    }

    // berry
    if (!this.checkItem(ItemType.Berry, BERRY_TARGET)) {
      return false;
    }

    this.removeItem(ItemType.Berry, 4);

    return true;
  }
}
