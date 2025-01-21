import { SCENE_GAME, SceneFlag } from "@game/scenes/game/scene";
import { NpcDetails, NpcDialogue, NpcObject, NpcObjectConfig, NpcState } from "../../npc.object";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";
import { SpriteAnimation } from "@core/model/sprite-animation";

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

export class WorkmanObject extends NpcObject {

  constructor(
    protected scene: SCENE_GAME,
    protected config: Config
  ) {
    super(scene, config);
  }

  get details(): NpcDetails {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.workman.details;
  }

  get dialogue(): NpcDialogue {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.workman.text.dialogue;
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATIONS;
  }

  get introFlag(): SceneFlag {
    return SceneFlag.intro_tool_salesman;
  }

}