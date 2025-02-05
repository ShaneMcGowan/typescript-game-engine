import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChickenObject } from '@game/objects/chicken.object';
import { AnimationsPlayer, type PlayerActionAnimationCallback } from '@game/constants/animations/player.animations';
import { type PlayerObject } from '@game/objects/player.object';

export function useAxeOnChicken(scene: SCENE_GAME, player: PlayerObject, object: ChickenObject): void {
  const callback: PlayerActionAnimationCallback = () => {
    object.say(
      'No thanks, I got a haircut last week.'
    );
  };

  player.startAnimation(
    AnimationsPlayer.UseAxe[player.direction],
    callback
  );
}
