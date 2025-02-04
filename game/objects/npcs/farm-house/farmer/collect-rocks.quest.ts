import { SCENE_GAME, StoryFlag } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";

export class QuestCollectRocks extends Quest {

  id: QuestName = QuestName.collect_rocks;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ){
    super(scene, npc);
  }

  get text(): QuestText {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.collect_rocks;
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