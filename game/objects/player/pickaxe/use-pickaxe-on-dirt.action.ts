import { SCENE_GAME } from "@game/scenes/game/scene";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer } from "@game/constants/animations/player.animations";
import { DirtObject } from "@game/objects/dirt.object";

export function usePickaxeOnDirt(scene: SCENE_GAME, player: PlayerObject, object: DirtObject): void {
  const callback = () => {
    object.destroy();
  };

  player.startAnimation(
    AnimationsPlayer.UsePickaxe[player.direction],
    callback,
  )
}