import { SCENE_GAME, StoryFlag, } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";
import { ItemObject } from "@game/objects/item.object";

const QUEST_NAME: QuestName = QuestName.collect_berries;

export class QuestCollectBerries extends Quest {

  id: QuestName = QUEST_NAME;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests[this.id];
  }

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.GateKey);
    this.scene.setStoryFlag(StoryFlag.world_collect_berries_started, true);
  }

  onSuccess(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Shovel);
    this.scene.globals.inventory.addToInventory(ItemType.Berry);
    this.scene.setStoryFlag(StoryFlag.world_collect_berries_completed, true);
  }

  check(): boolean {
    // watering can
    if(!this.checkItem(ItemType.WateringCan, 1)){
      return false;
    }

    // berry 
    if(!this.checkItem(ItemType.Berry, 4)){
      return false;
    }

    this.removeItem(ItemType.Berry, 4);
    
    return true; 
  }

}