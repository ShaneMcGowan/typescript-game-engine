import { SCENE_GAME } from "@game/scenes/game/scene";
import { HoleObject } from "@game/objects/hole.object";

/**
 * Fill in hole
 * @param scene 
 * @param object 
 */
export function useShovelOnHole(scene: SCENE_GAME, object: HoleObject): void {
  object.destroy();
}