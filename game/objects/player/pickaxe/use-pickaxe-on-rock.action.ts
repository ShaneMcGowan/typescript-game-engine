import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type RockObject } from '@game/objects/rock.object';
import { ItemObject } from '@game/objects/item.object';
import { ItemType } from '@game/models/inventory.model';
import { MessageUtils } from '@game/utils/message.utils';
import { type PlayerObject } from '@game/objects/player.object';
import { AnimationsPlayer, type PlayerActionAnimationCallback } from '@game/constants/animations/player.animations';

export function usePickaxeOnRock(scene: SCENE_GAME, player: PlayerObject, object: RockObject): void {
  const callback: PlayerActionAnimationCallback = () => {
    if (!object.canBeBroken) {
      MessageUtils.showMessage(
        scene,
        'This rock is too tough to break.'
      );
      return;
    }

    // drop rock on ground
    scene.addObject(new ItemObject(
      scene,
      {
        type: object.drops,
        x: object.transform.position.world.x,
        y: object.transform.position.world.y,
      }
    ));

    // destroy rock
    object.destroy();
  };

  player.startAnimation(
    AnimationsPlayer.UsePickaxe[player.direction],
    callback
  );
}
