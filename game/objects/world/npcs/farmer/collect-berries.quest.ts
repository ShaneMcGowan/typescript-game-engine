import { QuestStatus, SCENE_GAME, SceneFlag } from "@game/scenes/game/scene";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";
import { ItemObject } from "@game/objects/item.object";
import { GateObject } from "../../gate.object";

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
  }

  onSuccess(): void {
    this.scene.globals.inventory.addToInventory(ItemType.Shovel);
    this.scene.globals.inventory.addToInventory(ItemType.Berry);
  }

  check(): boolean {
    return this.checkItem(ItemType.Berry, 4);
  }

  static setup(scene: SCENE_GAME): void {
    // TODO: it would be great to not have to declare this on a per quest basis
    // TODO: different items need to be placed based on the quest state. e.g. the watering can should only be able to be picked up once.
    // but what happens if the player drops it, we could make it a key item then swap it out for a regular one later?
    // but we need to prevent player picking it up, saving the game and then picking it up again.
    // some sort of QuestStep system to track progress of quests

    if (scene.globals.quests[QUEST_NAME].complete) {
      return;
    }

    scene.addObject(new ItemObject(scene, { x: 1, y: 7, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { x: 2, y: 8, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { x: 17, y: 4, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { x: 16, y: 5, type: ItemType.Berry }));
    scene.addObject(new ItemObject(scene, { x: 12, y: 4, type: ItemType.WateringCan, pickupMessage: `This must be the watering can the Farmer was talking about. It looks pretty beat up but it's better than nothing.` }))
  }

}