import { SCENE_GAME } from "@game/scenes/game/scene";
import { HoleObject } from "@game/objects/hole.object";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer, PlayerActionAnimationCallback } from "@game/constants/animations/player.animations";

/**
 * Fill in hole
 * @param scene 
 * @param object 
 */
export function useShovelOnHole(scene: SCENE_GAME, player: PlayerObject, object: HoleObject): void {

  const callback: PlayerActionAnimationCallback = () => {
    object.destroy();
  }

  player.startAnimation(
    AnimationsPlayer.UseShovel[player.direction],
    callback,
  )
}