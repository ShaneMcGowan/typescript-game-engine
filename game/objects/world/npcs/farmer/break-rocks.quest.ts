import { QuestName, SCENE_GAME } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestText } from "@game/models/quest.model";

export class QuestBreakRocks extends Quest {

  id: QuestName = QuestName.break_rocks;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ){
    super(scene, npc);
  }

  get text(): QuestText {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.break_rocks;
  }

  onSuccess(): void {
  }

  check(): boolean {
    return this.checkItem(ItemType.Rock, 8);
  }
  
}