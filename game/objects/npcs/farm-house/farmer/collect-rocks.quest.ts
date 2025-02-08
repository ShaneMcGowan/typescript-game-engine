import { type SCENE_GAME, StoryFlag } from '@game/scenes/game/scene';
import { Inventory, ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';

export class QuestCollectRocks extends Quest {
  id: QuestName = QuestName.collect_rocks;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return {
      intro: `Next we need to find some ${Inventory.getItemName(ItemType.Rock, true)}, then I can start making you some tools. There should be some ${Inventory.getItemName(ItemType.Rock, true)} on the beach. Bring me back 4 ${Inventory.getItemName(ItemType.Rock, true)}.`,
      failure: `Head down to the beach and bring me back 4 ${Inventory.getItemName(ItemType.Rock, true)}, then I can make you some tools.`,
      success: `Always remember, if you get stuck for resources, things tend to wash up on the beach over night, so be sure to check the beach every morning.`,
    };
  }

  onIntro(): void {
    this.scene.setStoryFlag(StoryFlag.world_collect_rocks_started, true);
  }

  onSuccess(): void {
    this.scene.setStoryFlag(StoryFlag.world_collect_rocks_completed, true);
  }

  check(): boolean {
    return this.checkAndRemoveItem(ItemType.Rock, 4);
  }
}
