import { SCENE_GAME } from "@game/scenes/game/scene";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer } from "@game/constants/animations/player.animations";

export function usePickaxe(scene: SCENE_GAME, player: PlayerObject): void {
  player.startAnimation(
    AnimationsPlayer.UsePickaxe[player.direction],
  )
}