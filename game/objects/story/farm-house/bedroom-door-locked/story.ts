import { SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { FarmHouseBedroomDoorObject } from './bedroom-door.object';

export interface Config extends SceneObjectBaseConfig {
}


export class StoryFarmHouseBedroomDoorLockedObject extends StoryObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.farm_house_bedroom_door_locked_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.farm_house_bedroom_door_locked_completed;
  }

  onStart(): void {
    this.addChild(new FarmHouseBedroomDoorObject(this.scene, {  x: 18, y: 7 }));
  }

  onComplete(): void {
    this.destroy();
  }

}