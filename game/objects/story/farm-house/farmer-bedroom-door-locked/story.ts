import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { BedroomDoorObject } from './bedroom-door.object';

export interface Config extends SceneObjectBaseConfig {
}

export class StoryFarmHouseFarmerBedroomDoorLocked extends StoryObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.farm_house_farmer_bedroom_door_locked_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.farm_house_farmer_bedroom_door_locked_completed;
  }

  onStart(): void {
    this.addChild(new BedroomDoorObject(this.scene, { x: 13, y: 7, }));
  }

  onComplete(): void {
    this.destroy();
  }
}
