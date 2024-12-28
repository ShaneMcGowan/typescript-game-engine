import { SCENE_GAME } from "@game/scenes/game/scene";
import { TreeObject } from "@game/objects/tree.object";
import { TextboxObject } from "@game/objects/textbox.object";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";

export function useAxeOnTree(scene: SCENE_GAME, object: TreeObject): void {

  object.chopCounter++;
  if(object.chopCounter < object.chopCounterMax){
    return;
  }

  scene.globals.player.enabled = false;

  const textbox = new TextboxObject(
    scene,
    {
      text: `The tree tumbles to the ground.`,
      onComplete: () => {
        scene.globals.player.enabled = true;
      },
    }
  )
  scene.addObject(textbox);
  
  object.destroy();

  scene.addObject(new ItemObject(
    scene, 
    {
      type: ItemType.Log,
      positionX: object.transform.position.world.x,
      positionY: object.transform.position.world.y,
    }
  ))
}