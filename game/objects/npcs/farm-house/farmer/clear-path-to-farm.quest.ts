import { type SCENE_GAME, SceneFlag } from '@game/scenes/game/scene';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';
import { ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';

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
}
