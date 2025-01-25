import { SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { GateObject } from '@game/objects/world/gate.object';
import { ItemType } from '@game/models/inventory.model';

export interface Config extends SceneObjectBaseConfig {
}


export class StoryWorldHillGateObject extends StoryObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_hill_gate_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_hill_gate_completed;
  }

  onStart(): void {
    // rocks
    this.addChild(new GateObject(this.scene, { x: 10, y: 7, key: ItemType.GateKey, flag: StoryFlag.world_hill_gate_completed }));
  }

  onComplete(): void {
    this.destroy();
  }

}