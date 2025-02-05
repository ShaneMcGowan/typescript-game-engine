import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type DirtObject } from '@game/objects/dirt.object';

export function useSeedOnDirt(scene: SCENE_GAME, object: DirtObject): void {
  if (!object.isEmpty) {
    return;
  }

  object.actionPlantHeldItem();
}
