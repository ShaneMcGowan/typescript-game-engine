import { SCENE_GAME } from "@game/scenes/game/scene";
import { RockObject } from "@game/objects/rock.object";
import { ItemObject } from "@game/objects/item.object";
import { ItemType } from "@game/models/inventory.model";
import { MessageUtils } from "@game/utils/message.utils";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer, PlayerActionAnimationCallback } from "@game/constants/animations/player.animations";

export function usePickaxeOnRock(scene: SCENE_GAME, player: PlayerObject, object: RockObject): void {

  const callback: PlayerActionAnimationCallback = () => {
    if(!object.canBeBroken){
      MessageUtils.showMessage(
        scene,
        `This rock is too tough to break.`,
      );
      return;
    }
    
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

  player.startAnimation(
    AnimationsPlayer.UsePickaxe[player.direction],
    callback,
  );
}