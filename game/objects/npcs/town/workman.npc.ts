import { type SCENE_GAME, SceneFlag } from '@game/scenes/game/scene';
import { type InteractionStage, type InteractionStageIntro, NpcDetails, NpcDialogue, NpcObject, type NpcObjectConfig, type NpcState } from '../../npc.object';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';
import { SpriteAnimation } from '@core/model/sprite-animation';
import { type Portrait } from '@game/objects/textbox.object';

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

  get name(): string {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.workman.details.name;
  }

  get portrait(): Portrait {
    return SCENE_GAME_MAP_WORLD_TEXT.npcs.workman.details.portrait;
  }

  get intro(): InteractionStageIntro {
    return {
      text: SCENE_GAME_MAP_WORLD_TEXT.npcs.workman.text.dialogue.intro,
      flag: SceneFlag.intro_workman,
    };
  }

  get default(): InteractionStage {
    return {
      text: SCENE_GAME_MAP_WORLD_TEXT.npcs.workman.text.dialogue.default,
    };
  }

  get animations(): Record<NpcState, SpriteAnimation> {
    return ANIMATIONS;
  }
}
