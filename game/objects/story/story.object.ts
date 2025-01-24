import { SceneObject, SceneObjectBaseConfig } from '@core/model/scene-object';
import { SceneFlag, StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';

export interface Config extends SceneObjectBaseConfig {
}


export class StoryObject extends SceneObject {

  started: boolean = false;
  completing: boolean = false;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.default_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.default_completed;
  }

  onUpdate(): void {
    if(!this.scene.getStoryFlag(this.flagStart)){
      return;
    }

    if(!this.started){
      this.started = true;
      this.onStart();
      return;
    }

    if(!this.scene.getStoryFlag(this.flagComplete)){
      return;
    }

    if(this.completing){
      return;
    }

    this.completing = true;
    this.onComplete();
  }

  onStart(): void {
    console.log('[StoryObject] onStart');
  }

  onComplete(): void {
    console.log('[StoryObject] onComplete');
  }


}