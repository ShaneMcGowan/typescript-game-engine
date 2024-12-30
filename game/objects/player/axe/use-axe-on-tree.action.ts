import { SCENE_GAME } from "@game/scenes/game/scene";
import { TreeObject } from "@game/objects/tree.object";
import { TextboxObject } from "@game/objects/textbox.object";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";
import { TreeStumpObject } from "@game/objects/tree-stump.object";
import { PlayerObject } from "@game/objects/player.object";

export function useAxeOnTree(scene: SCENE_GAME, player: PlayerObject, object: TreeObject): void {

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

  // stump
  scene.addObject(new TreeStumpObject(
    scene, 
    {
      type: object.type,
      positionX: object.transform.position.world.x,
      positionY: object.transform.position.world.y,
    }
  ))

  // log - position based on the direction the tree was chopped from, it looks nicer
  let relativeX = player.transform.position.world.x - object.transform.position.world.x;
  let relativeY = player.transform.position.world.y - object.transform.position.world.y;
  if(relativeX < 0){
    relativeX = 1;
  } else if (relativeX > 0){
    relativeX = -1
  }

  if(relativeY < 0){
    relativeY = 1;
  } else if (relativeY > 0){
    relativeY = -1
  }

  scene.addObject(new ItemObject(
    scene, 
    {
      type: ItemType.Log,
      positionX: object.transform.position.world.x + relativeX,
      positionY: object.transform.position.world.y + relativeY,
    }
  ))

  for(let i = 0; i < object.fruit; i++){
    scene.addObject(new ItemObject(
      scene, 
      {
        type: ItemType.Berry,
        positionX: object.transform.position.world.x + 1, // TODO: this should fall in an available space rather than a stack
        positionY: object.transform.position.world.y,
      }
    ))
  }
}