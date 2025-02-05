import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type SceneObject } from '@core/model/scene-object';
import { ChickenObject } from '@game/objects/chicken.object';
import { useCropOnChicken } from './use-crop-on-chicken.action';
import { type PlayerObject } from '@game/objects/player.object';

export function useCrop(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  switch (true) {
    case target instanceof ChickenObject:
      useCropOnChicken(scene, target);
  }
}
