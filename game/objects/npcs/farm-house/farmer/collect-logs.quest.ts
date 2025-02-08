import { type SCENE_GAME, StoryFlag } from '@game/scenes/game/scene';
import { Inventory, ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';

export class QuestCollectLogs extends Quest {
  id: QuestName = QuestName.collect_logs;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return {
      intro: `If you want to get to work, we will need to get you some tools. I'm out of supplies at the minute so to start, bring me 4 ${Inventory.getItemName(ItemType.Log, true)}. You should be able to find some washed up on the beach.`,
      failure: `Bring me 4 ${Inventory.getItemName(ItemType.Log, true)}. You should be able to find some washed up on the beach.`,
      success: `Great work, just a few more tasks and you'll be right on your way to being a farmer like me.`,
    };
  }

  onIntro(): void {
    this.scene.setStoryFlag(StoryFlag.world_collect_logs_started, true);
  }

  onSuccess(): void {
    this.scene.setStoryFlag(StoryFlag.world_collect_logs_completed, true);
  }

  check(): boolean {
    return this.checkAndRemoveItem(ItemType.Log, 4);
  }
}
