import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer, PlayerActionAnimationCallback } from "@game/constants/animations/player.animations";

export function useShovelOnChicken(scene: SCENE_GAME, player: PlayerObject, object: ChickenObject): void {
  
  const callback: PlayerActionAnimationCallback = () => {
    object.say(
      'I dig you too, pal.'
    );
  }

  player.startAnimation(
    AnimationsPlayer.UseShovel[player.direction],
    callback,
  )
}