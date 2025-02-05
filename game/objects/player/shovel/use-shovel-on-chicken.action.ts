import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChickenObject } from '@game/objects/chicken.object';
import { type PlayerObject } from '@game/objects/player.object';
import { AnimationsPlayer, type PlayerActionAnimationCallback } from '@game/constants/animations/player.animations';

export function useShovelOnChicken(scene: SCENE_GAME, player: PlayerObject, object: ChickenObject): void {
  const callback: PlayerActionAnimationCallback = () => {
    object.say(
      'I dig you too, pal.'
    );
  };

  player.startAnimation(
    AnimationsPlayer.UseShovel[player.direction],
    callback
  );
}
