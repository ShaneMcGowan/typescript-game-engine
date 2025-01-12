import { SceneObject } from "@core/model/scene-object";
import { AnimationsPlayer } from "@game/constants/animations/player.animations";
import { PlayerObject } from "@game/objects/player.object";
import { SCENE_GAME } from "@game/scenes/game/scene";

export function useWateringCan(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {  
  player.startAnimation(
    AnimationsPlayer.UseWateringCan[player.direction],
  );
}