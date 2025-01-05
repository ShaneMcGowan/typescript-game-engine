import { QuestName, SCENE_GAME } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestText } from "@game/models/quest.model";

export class QuestCollectBerries extends Quest {

  id: QuestName = QuestName.collect_wheat;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ){
    super(scene, npc);
  }

  get text(): QuestText {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.collect_berries;
  }

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.GateKey);
  }

  onSuccess(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Shovel);
    this.scene.globals.inventory.addToInventory(ItemType.Berry);
  }

  check(): boolean {
    return this.checkItem(ItemType.Berry, 4);
  }
  
}