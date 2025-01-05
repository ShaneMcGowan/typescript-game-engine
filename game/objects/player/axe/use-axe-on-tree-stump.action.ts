import { SCENE_GAME } from "@game/scenes/game/scene";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";
import { TreeStumpObject } from "@game/objects/tree-stump.object";
import { AnimationsPlayer, PlayerActionAnimationCallback } from "@game/constants/animations/player.animations";
import { PlayerObject } from "@game/objects/player.object";

export function useAxeOnTreeStump(scene: SCENE_GAME, player: PlayerObject, object: TreeStumpObject): void {
  
  const callback: PlayerActionAnimationCallback = () => {
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
        x: object.transform.position.world.x,
        y: object.transform.position.world.y,
      }
    ));
  }

  player.startAnimation(
    AnimationsPlayer.UseAxe[player.direction],
    callback,
  );
  
}