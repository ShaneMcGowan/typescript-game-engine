import { SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { LockObject } from '@game/objects/lock.object';
import { ItemType } from '@game/models/inventory.model';
import { TreeObject } from '@game/objects/tree.object';

export interface Config extends SceneObjectBaseConfig {
}


export class StoryWorldHillPathToTownBlockadeObject extends StoryObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_hill_path_to_town_blockade_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_hill_path_to_town_blockade_completed;
  }

  onStart(): void {
    const onDestroy = () => {
      this.scene.setStoryFlag(this.flagComplete, true);
    }

    this.addChild(new TreeObject(this.scene, { x: 10, y: 2, type: 'small', logOnDestroy: false, stumpOnDestroy: false, onDestroy }));
  }

  onComplete(): void {
    this.destroy();
  }

}