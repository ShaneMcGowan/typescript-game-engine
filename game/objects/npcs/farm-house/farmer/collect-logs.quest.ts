import { type SCENE_GAME, StoryFlag } from '@game/scenes/game/scene';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';
import { ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';
import { ItemObject } from '@game/objects/item.object';

export class QuestCollectLogs extends Quest {
  id: QuestName = QuestName.collect_logs;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.collect_logs;
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
