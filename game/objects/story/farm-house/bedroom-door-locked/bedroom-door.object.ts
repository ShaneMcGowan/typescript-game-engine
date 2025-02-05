import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type LockConfig, LockObject, LockType } from '@game/objects/lock.object';
import { ItemType } from '@game/models/inventory.model';

interface Config extends LockConfig {

}

export class FarmHouseBedroomDoorObject extends LockObject {
  // config

  // state

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  get type(): LockType {
    return LockType.Door;
  }

  get key(): ItemType {
    return ItemType.RoomKeyFarmersSonBedroom;
  }

  get flag(): StoryFlag {
    return StoryFlag.farm_house_bedroom_door_locked_completed;
  }

  get messageIntro(): string {
    return `The door to the Farmer's Son's bedroom is locked. I wonder if he would let me in?`;
  }
}
