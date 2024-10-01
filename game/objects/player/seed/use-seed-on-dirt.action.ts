import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";

export function useSeedOnDirt(scene: SCENE_GAME, object: DirtObject): void {
  object.actionPlant();
}