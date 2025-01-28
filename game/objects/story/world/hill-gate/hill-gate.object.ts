import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants"
import { LockConfig, LockObject, LockType } from '@game/objects/lock.object';
import { ItemType } from '@game/models/inventory.model';


interface Config extends LockConfig {

}

export class HillGateObject extends LockObject {

  // config

  // state

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  get type(): LockType {
    return LockType.Gate;
  }

  get key(): ItemType {
    return ItemType.GateKey;
  }

  get flag(): StoryFlag {
    return StoryFlag.world_hill_gate_completed;
  }

  get messageNoKey(): string {
    return SCENE_GAME_MAP_WORLD_TEXT.objects.gate.interact.no_key;
  }

}
