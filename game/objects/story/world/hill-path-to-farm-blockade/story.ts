import { SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { RockObject } from '@game/objects/rock.object';

export interface Config extends SceneObjectBaseConfig {
}


export class StoryWorldHillPathToFarmBlockadeObject extends StoryObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_hill_path_to_farm_blockade_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_hill_path_to_farm_blockade_completed;
  }

  onStart(): void {
    const onDestroy = () => {
      this.scene.setStoryFlag(this.flagComplete, true);
    }
    
    this.scene.addObject(new RockObject(this.scene, { x: 1, y: 12, onDestroy: onDestroy }));
    this.scene.addObject(new RockObject(this.scene, { x: 2, y: 13, onDestroy: onDestroy }));
  }

  onComplete(): void {
    this.destroy();
  }

}