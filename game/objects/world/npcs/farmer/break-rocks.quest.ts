import { SCENE_GAME } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";
import { RockObject } from "@game/objects/rock.object";

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

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Pickaxe);
  }

  check(): boolean {
    return this.checkItem(ItemType.Rock, 8);
  }

  static setup(scene: SCENE_GAME): void {
    scene.addObject(new RockObject(scene, { positionX: 21, positionY: 6 }));
    scene.addObject(new RockObject(scene, { positionX: 23, positionY: 8 }));
    scene.addObject(new RockObject(scene, { positionX: 6, positionY: 10 }));
    scene.addObject(new RockObject(scene, { positionX: 11, positionY: 13 }));
    scene.addObject(new RockObject(scene, { positionX: 24, positionY: 14 }));
    scene.addObject(new RockObject(scene, { positionX: 8, positionY: 15 }));
    scene.addObject(new RockObject(scene, { positionX: 20, positionY: 11 }));
    scene.addObject(new RockObject(scene, { positionX: 17, positionY: 16 }));
  }
  
}