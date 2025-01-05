import { SCENE_GAME } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";
import { ItemObject } from "@game/objects/item.object";

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

  static setup(scene: SCENE_GAME): void {
    scene.addObject(new ItemObject(scene, { positionX: 1, positionY: 7, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { positionX: 2, positionY: 8, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { positionX: 17, positionY: 4, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { positionX: 16, positionY: 5, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { positionX: 12, positionY: 4, type: ItemType.WateringCan, pickupMessage: `This must be the watering can the Farmer was talking about. It looks pretty beat up but it's better than nothing.` }))
  }
  
}