import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";
import { Position } from "@game/models/position.model";

export function useHoe(scene: SCENE_GAME, position: Position): void {
  scene.addObject(new DirtObject(
    scene,
    {
      positionX: position.x,
      positionY: position.y,
    }
  ));
}