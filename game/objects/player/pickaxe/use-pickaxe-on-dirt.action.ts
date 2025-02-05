import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type PlayerObject } from '@game/objects/player.object';
import { AnimationsPlayer } from '@game/constants/animations/player.animations';
import { type DirtObject } from '@game/objects/dirt.object';

export function usePickaxeOnDirt(scene: SCENE_GAME, player: PlayerObject, object: DirtObject): void {
  const callback = () => {
    object.destroy();
  };

  player.startAnimation(
    AnimationsPlayer.UsePickaxe[player.direction],
    callback
  );
}
