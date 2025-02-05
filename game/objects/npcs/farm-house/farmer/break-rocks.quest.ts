import { type SCENE_GAME } from '@game/scenes/game/scene';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';
import { ItemType } from '@game/models/inventory.model';
import { type NpcObject } from '@game/objects/npc.object';
import { Quest, QuestName, type QuestText } from '@game/models/quest.model';
import { RockObject } from '@game/objects/rock.object';

export class QuestBreakRocks extends Quest {
  id: QuestName = QuestName.break_rocks;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) {
    super(scene, npc);
  }

  get text(): QuestText {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmer.text.quests.break_rocks;
  }

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Pickaxe);
  }

  check(): boolean {
    return this.checkAndRemoveItem(ItemType.Rock, 8);
  }

  static setup(scene: SCENE_GAME): void {
    scene.addObject(new RockObject(scene, { x: 21, y: 6, }));
    scene.addObject(new RockObject(scene, { x: 23, y: 8, }));
    scene.addObject(new RockObject(scene, { x: 6, y: 10, }));
    scene.addObject(new RockObject(scene, { x: 11, y: 13, }));
    scene.addObject(new RockObject(scene, { x: 24, y: 14, }));
    scene.addObject(new RockObject(scene, { x: 8, y: 15, }));
    scene.addObject(new RockObject(scene, { x: 20, y: 11, }));
    scene.addObject(new RockObject(scene, { x: 17, y: 16, }));
  }
}
