import { SCENE_GAME, SceneFlag } from "@game/scenes/game/scene";
import { ItemType } from "@game/models/inventory.model";
import { NpcObject } from "@game/objects/npc.object";
import { Quest, QuestName, QuestText } from "@game/models/quest.model";

export class QuestGetSomeSleep extends Quest {

  id: QuestName = QuestName.get_some_sleep;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ){
    super(scene, npc);
  }

  get text(): QuestText {
    return {
      intro: `Look, I'm about to break the fourth wall here but I'm not allowed to do that so don't tell my Father, okay? If you want to save the game you need to sleep in a bed. You can't sleep in all beds because some just aren't comfy enough but you can take a nap in mine any time you want to save the game. Take this key to my bedroom and go have yourself a nap.`,
      failure: `Go have a nap in my bed and save the game. And don't just pretend to have a nap, I'll know. I know the guy who makes this game and he'll tell me if you don't actually have a nap.`,
      success: `Fantastic, now you know how to save the game! Don't tell my Father that I broke the fourth wall though, he tells me this isn't a simulation but I know he's lying and he gets mad when I call him on it.`,
    } 
  }

  onIntro(): void {
    this.scene.globals.inventory.addToInventory(ItemType.RoomKeyFarmersSonBedroom);
  }

  check(): boolean {
    return this.scene.getFlag(SceneFlag.slept_in_farm_house_bed);
  }
  
}