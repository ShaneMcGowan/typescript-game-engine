import { type SCENE_GAME, SceneFlag } from '@game/scenes/game/scene';
import { SCENE_GAME_MAP_WORLD_TEXT } from '@game/constants/world-text.constants';
import { SpriteAnimation } from '@core/model/sprite-animation';
import { type NpcState, type NpcObjectConfig, NpcObject, type NpcDetails, type NpcDialogue } from '@game/objects/npc.object';
import { Direction } from '@game/models/direction.model';

const ANIMATION_DEFAULT: SpriteAnimation = new SpriteAnimation('tileset_player', []);

const ANIMATION_MINE: Record<Direction, SpriteAnimation> = {
  [Direction.Up]: new SpriteAnimation('tileset_actions', [
    { spriteX: 0, spriteY: 3, spriteWidth: 3, spriteHeight: 3, duration: 0.4, },
    { spriteX: 3, spriteY: 3, spriteWidth: 3, spriteHeight: 3, duration: 0.4, }
  ]),
  [Direction.Down]: new SpriteAnimation('tileset_actions', [
    { spriteX: 0, spriteY: 0, spriteWidth: 3, spriteHeight: 3, duration: 0.4, },
    { spriteX: 3, spriteY: 0, spriteWidth: 3, spriteHeight: 3, duration: 0.4, }
  ]),
  [Direction.Left]: new SpriteAnimation('tileset_actions', [
    { spriteX: 0, spriteY: 6, spriteWidth: 3, spriteHeight: 3, duration: 0.4, },
    { spriteX: 3, spriteY: 6, spriteWidth: 3, spriteHeight: 3, duration: 0.4, }
  ]),
  [Direction.Right]: new SpriteAnimation('tileset_actions', [
    { spriteX: 0, spriteY: 9, spriteWidth: 3, spriteHeight: 3, duration: 0.4, },
    { spriteX: 3, spriteY: 9, spriteWidth: 3, spriteHeight: 3, duration: 0.4, }
  ]),
};
export interface Config extends NpcObjectConfig {
}

export class WorkerObject extends NpcObject {
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
    return {
      idle: ANIMATION_MINE[this.direction],
      moving: ANIMATION_DEFAULT,
    };
  }

  get introFlag(): SceneFlag {
    return SceneFlag.intro_tool_salesman;
  }
}
