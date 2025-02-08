import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Inventory, ItemType } from '@game/models/inventory.model';
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
    return {
      intro: `Here is a ${Inventory.getItemName(ItemType.Pickaxe)}, time to make yourself useful. it's not very strong but should be able to break through most of the ${Inventory.getItemName(ItemType.Rock, true)} there. I need someone to get rid of all those damn ${Inventory.getItemName(ItemType.Rock, true)} in my field. You can't grow plants if there are ${Inventory.getItemName(ItemType.Rock, true)} in the way. I used to break ${Inventory.getItemName(ItemType.Rock, true)} all day long as part of a chain gang. Went down for 3 counts of not thanking the bus driver. I've since seen the error of my ways, but I refuse to ever break ${Inventory.getItemName(ItemType.Rock, true)} myself again. Bring me back 8 ${Inventory.getItemName(ItemType.Rock, true)}.`,
      failure: `Come back to me once you've collected 8 ${Inventory.getItemName(ItemType.Rock, true)}. Don't worry if some are too tough to break, we can deal with those later.`,
      success: `Great work, my field has never looked so ${Inventory.getItemName(ItemType.Rock)} free, and that's a compliment where I come from.`,
    };
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
