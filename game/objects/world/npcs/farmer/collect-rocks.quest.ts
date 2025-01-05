import { SCENE_GAME } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";
import { ItemObject } from "@game/objects/item.object";

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

  check(): boolean {
    return this.checkItem(ItemType.Rock, 4);
  }

  static setup(scene: SCENE_GAME): void {
    scene.addObject(new ItemObject(scene, { x: 29, y: 15, type: ItemType.Rock }));
    scene.addObject(new ItemObject(scene, { x: 24, y: 19, type: ItemType.Rock }));
    scene.addObject(new ItemObject(scene, { x: 23, y: 21, type: ItemType.Rock }));
    scene.addObject(new ItemObject(scene, { x: 28, y: 20, type: ItemType.Rock }));
  }
  
}