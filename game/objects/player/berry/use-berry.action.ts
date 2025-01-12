import { SCENE_GAME } from "@game/scenes/game/scene";
import { PlayerObject } from "@game/objects/player.object";
import { SceneObject } from "@core/model/scene-object";
import { useBerryOnHole } from "./use-berry-on-hole.action";
import { HoleObject } from "@game/objects/hole.object";

/**
 * Plant berry
 * @param scene 
 * @param object 
 */
export function useBerry(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  switch(true){
    case target instanceof HoleObject:
      useBerryOnHole(scene, target);
      return;
  }
}