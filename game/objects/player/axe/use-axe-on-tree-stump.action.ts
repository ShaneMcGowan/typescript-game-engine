import { SCENE_GAME } from "@game/scenes/game/scene";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";
import { TreeStumpObject } from "@game/objects/tree-stump.object";

export function useAxeOnTreeStump(scene: SCENE_GAME, object: TreeStumpObject): void {

  object.chopCounter++;
  if(object.chopCounter < object.chopCounterMax){
    return;
  }
  
  object.destroy();

  // log
  scene.addObject(new ItemObject(
    scene, 
    {
      type: ItemType.Log,
      positionX: object.transform.position.world.x,
      positionY: object.transform.position.world.y,
    }
  ))
}