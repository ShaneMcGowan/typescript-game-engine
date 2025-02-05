import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { HillGateObject } from './hill-gate.object';

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
    this.addChild(new HillGateObject(this.scene, { x: 10, y: 7, }));
  }

  onComplete(): void {
    this.destroy();
  }
}
