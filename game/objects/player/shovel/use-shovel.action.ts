import { SCENE_GAME } from "@game/scenes/game/scene";
import { Input } from "@core/utils/input.utils";
import { HoleObject } from "@game/objects/hole.object";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer, PlayerActionAnimationCallback } from "@game/constants/animations/player.animations";
import { FarmingUtils } from "@game/utils/farming.utils";

export function useShovel(scene: SCENE_GAME, player: PlayerObject): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);
  const isFarmable = FarmingUtils.isPositionFarmable(scene, x, y);

  const callback: PlayerActionAnimationCallback = () => {

    const object = new HoleObject(
      scene,
      {
        x: x,
        y: y,
      }
    ); 
    scene.addObject(object);
  }

  player.startAnimation(
    AnimationsPlayer.UseShovel[player.direction],
    isFarmable ? callback : undefined,
  )
}