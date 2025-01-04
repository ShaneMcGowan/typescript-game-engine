import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";
import { AnimationsPlayer, PlayerActionAnimationCallback } from "@game/constants/animations/player.animations";
import { PlayerObject } from "@game/objects/player.object";

export function useHoeOnChicken(scene: SCENE_GAME, player: PlayerObject, object: ChickenObject): void {
  
  const callback: PlayerActionAnimationCallback = () => {
    object.say(
      `Farmin' ain't easy.`
    );
  }

  player.startAnimation(
    AnimationsPlayer.UseHoe[player.direction],
    callback
  );
}