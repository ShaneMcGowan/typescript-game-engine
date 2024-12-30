import { SCENE_GAME } from "@game/scenes/game/scene";
import { RockObject } from "@game/objects/rock.object";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";

export function usePickaxeOnRock(scene: SCENE_GAME, object: RockObject): void {

  // drop rock on ground
  scene.addObject(new ItemObject(
    scene, 
    {
      type: ItemType.Rock,
      positionX: object.transform.position.world.x,
      positionY: object.transform.position.world.y,
    }
  ));

  // destroy rock
  object.destroy();
}