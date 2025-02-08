import { type SCENE_GAME, SceneFlag } from '@game/scenes/game/scene';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';
import { Inventory, ItemType } from '@game/models/inventory.model';
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
    return {
      intro: `You're almost ready to do some actual farming, you just need one thing: a farm. The path to the farm has become overgrown. There are some trees blocking the path. Take this ${Inventory.getItemName(ItemType.Axe)} and clear a path.`,
      failure: `Take that ${Inventory.getItemName(ItemType.Axe)} I gave you and clear a path to the farm. I know you broke the ${Inventory.getItemName(ItemType.GateKey)} and left the gate open by the way so you should have no problem getting back up there. I can't believe you broke the ${Inventory.getItemName(ItemType.GateKey)}, I was going to give that to my son for his birthday.`,
      success: `Fantastic, now the farming can begin!`,
    };
  }

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Axe);
  }

  check(): boolean {
    return this.scene.globals.flags[SceneFlag.path_to_farm_cleared];
  }
}
