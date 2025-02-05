import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChickenObject } from '@game/objects/chicken.object';

export function useCropOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  object.actionGiveItem();
}
