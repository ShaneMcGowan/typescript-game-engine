import { QuestName, SCENE_GAME } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestText } from "@game/models/quest.model";

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

  onSuccess(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Pickaxe);
    this.scene.globals.inventory.addToInventory(ItemType.Axe);
  }

  check(): boolean {
    return this.checkItem(ItemType.Rock, 4);
  }
  
}