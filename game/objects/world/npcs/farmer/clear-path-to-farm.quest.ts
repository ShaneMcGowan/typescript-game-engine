import { SCENE_GAME, SceneFlag } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";
import { TreeObject } from "@game/objects/tree.object";

export class QuestClearPathToFarm extends Quest {

  id: QuestName = QuestName.clear_path_to_farm;

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
    this.scene.globals.inventory.addToInventory(ItemType.Axe);
  }

  check(): boolean {
    return this.scene.globals.flags[SceneFlag.path_to_farm_cleared];
  }

  static setup(scene: SCENE_GAME): void {
    const onDestroy = () => {
      scene.globals.flags[SceneFlag.path_to_farm_cleared] = true;
    }
    scene.addObject(new TreeObject(scene, { x: 1, y: 12, type: 'small', logOnDestroy: false, stumpOnDestroy: false, onDestroy: onDestroy }));
    scene.addObject(new TreeObject(scene, { x: 2, y: 13, type: 'small', logOnDestroy: false, stumpOnDestroy: false, onDestroy: onDestroy }));
  }

}