import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function useCropOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  object.actionGiveItem();
}