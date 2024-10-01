import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";

export function useWateringCanOnDirt(scene: SCENE_GAME, object: DirtObject): void {
  object.actionWater();
}