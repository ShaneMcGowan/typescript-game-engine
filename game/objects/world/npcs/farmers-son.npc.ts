import { SCENE_GAME, SceneFlag } from "@game/scenes/game/scene";
import { NpcDetails, NpcDialogue, NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { SpriteAnimation } from "@core/model/sprite-animation";
import { Quests } from "@game/constants/quests.constants";
import { QuestName } from "@game/models/quest.model";

const ANIMATIONS: Record<NpcState, SpriteAnimation> = {
  idle: new SpriteAnimation('tileset_player', [
    { spriteX: 1, spriteY: 1, duration: 0.5, },
    { spriteX: 4, spriteY: 1, duration: 0.5, }
  ]),
  moving: new SpriteAnimation('tileset_player', [
  ]),
};

export interface Config extends NpcObjectConfig {
}

export class FarmersSonObject extends NpcObject {

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
  }

  get details(): NpcDetails {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.details;
  }

  get dialogue(): NpcDialogue {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.farmers_son.text.dialogue;
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATIONS;
  }

  get introFlag(): SceneFlag {
    return SceneFlag.intro_farmers_son;
  }

  onIntro(): void {
    // open the shack door
    this.scene.globals.flags[SceneFlag.shack_door_open] = true;
  }

  interact(): void {
    Quests.StartQuest(this.scene, QuestName.collect_berries);
  }

}