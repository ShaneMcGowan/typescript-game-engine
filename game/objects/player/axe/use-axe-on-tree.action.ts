import { SCENE_GAME } from "@game/scenes/game/scene";
import { TreeObject } from "@game/objects/tree.object";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";
import { TreeStumpObject } from "@game/objects/tree-stump.object";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer, PlayerActionAnimationCallback } from "@game/constants/animations/player.animations";

export function useAxeOnTree(scene: SCENE_GAME, player: PlayerObject, object: TreeObject): void {
  
  const callback: PlayerActionAnimationCallback = () => {

    object.chopCounter++;
    if(object.chopCounter < object.chopCounterMax){
      return;
    }
    
    object.destroy();

    // stump
    if(object.stumpOnDestroy){
      scene.addObject(new TreeStumpObject(
        scene, 
        {
          type: object.type,
          x: object.transform.position.world.x,
          y: object.transform.position.world.y,
        }
      ));
    }

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

    if(object.logOnDestroy){
      scene.addObject(new ItemObject(
        scene, 
        {
          type: ItemType.Log,
          x: object.transform.position.world.x + relativeX,
          y: object.transform.position.world.y + relativeY,
        }
      ));
    }

    if(object.berryOnDestroy){
      for(let i = 0; i < object.fruit; i++){
        scene.addObject(new ItemObject(
          scene, 
          {
            type: ItemType.Berry,
            x: object.transform.position.world.x + 1, // TODO: this should fall in an available space rather than a stack
            y: object.transform.position.world.y,
          }
        ))
      }
    }
  }

  player.startAnimation(
    AnimationsPlayer.UseAxe[player.direction],
    callback,
  );
  
}