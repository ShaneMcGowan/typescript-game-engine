import { SceneObjectBaseConfig } from '@core/model/scene-object';
import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { StoryObject } from '../../story.object';
import { FarmersSonObject } from '@game/objects/npcs/world/farmers-son.npc';
import { LockedDoorObject } from '@game/objects/world/locked-door.object';

export interface Config extends SceneObjectBaseConfig {
}


export class StoryWorldFarmersHouseLockedObject extends StoryObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get flagStart(): StoryFlag {
    return StoryFlag.world_farmers_house_locked_started;
  }

  get flagComplete(): StoryFlag {
    return StoryFlag.world_farmers_house_locked_completed;
  }

  onStart(): void {
    this.addChild(new FarmersSonObject(this.scene, { x: 25, y: 16 }));
    this.addChild(new LockedDoorObject(this.scene, {  x: 23, y: 1 }));
  }

  onComplete(): void {
    this.destroy();
  }

}