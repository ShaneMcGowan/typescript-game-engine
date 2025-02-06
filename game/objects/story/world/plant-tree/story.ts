import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { FarmableAreaObject } from '@game/objects/areas/farmable-area.object';

export interface Config extends SceneObjectBaseConfig {
}

export class StoryWorldPlantTree extends StoryObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_plant_tree_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_plant_tree_completed;
  }

  onStart(): void {
    this.addChild(new FarmableAreaObject(this.scene, {
      x: 12,
      y: 4,
      width: 6,
      height: 2,
    }));
  }

  onComplete(): void {
    this.destroy();
  }
}
