import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type HoleObject } from '@game/objects/hole.object';
import { type PlayerObject } from '@game/objects/player.object';
import { AnimationsPlayer, type PlayerActionAnimationCallback } from '@game/constants/animations/player.animations';

/**
 * Fill in hole
 * @param scene
 * @param object
 */
export function useShovelOnHole(scene: SCENE_GAME, player: PlayerObject, object: HoleObject): void {
  const callback: PlayerActionAnimationCallback = () => {
    object.destroy();
  };

  player.startAnimation(
    AnimationsPlayer.UseShovel[player.direction],
    callback
  );
}
