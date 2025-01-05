import { SCENE_GAME } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";
import { ItemObject } from "@game/objects/item.object";

export class QuestCollectLogs extends Quest {

  id: QuestName = QuestName.collect_logs;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ){
    super(scene, npc);
  }

  get text(): QuestText {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.collect_logs;
  }

  check(): boolean {
    return this.checkItem(ItemType.Log, 4);
  }

  static setup(scene: SCENE_GAME): void {
    scene.addObject(new ItemObject(scene, { x: 7, y: 19, type: ItemType.Log }));
    scene.addObject(new ItemObject(scene, { x: 10, y: 21, type: ItemType.Log }));
    scene.addObject(new ItemObject(scene, { x: 14, y: 20, type: ItemType.Log }));
    scene.addObject(new ItemObject(scene, { x: 18, y: 22, type: ItemType.Log }));
  }
  
}