import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer } from "@game/constants/animations/player.animations";

export function useWateringCanOnDirt(scene: SCENE_GAME, player: PlayerObject, object: DirtObject): void {
  const callback = () => {
    object.actionWater();
  }

  player.startAnimation(
    AnimationsPlayer.UseWateringCan[player.direction],
    callback,
  )
}