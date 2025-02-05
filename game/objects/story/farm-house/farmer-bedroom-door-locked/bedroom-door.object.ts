import { StoryFlag, type SCENE_GAME } from '@game/scenes/game/scene';
import { type LockConfig, LockObject, LockType } from '@game/objects/lock.object';
import { ItemType } from '@game/models/inventory.model';

interface Config extends LockConfig {

}

export class BedroomDoorObject extends LockObject {
  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
  }

  get type(): LockType {
    return LockType.Door;
  }

  get key(): ItemType {
    return ItemType.FarmersBedroomKey;
  }

  get flag(): StoryFlag {
    return StoryFlag.farm_house_farmer_bedroom_door_locked_completed;
  }

  get messageIntro(): string {
    return `The door to the Farmer's bedroom is locked. Looking through the keyhole I can see a shiny chest. I wonder what's inside.`;
  }
}
