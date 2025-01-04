import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer } from "@game/constants/animations/player.animations";

export function useWateringCanOnChicken(scene: SCENE_GAME, player: PlayerObject, object: ChickenObject): void {
  const callback = () => {
    object.say(
      `No need to water me, I moisturise every morning. I have a very thorough skincare routine.`
    );
  }

  player.startAnimation(
    AnimationsPlayer.UseWateringCan[player.direction],
    callback,
  )
}