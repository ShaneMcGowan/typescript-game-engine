import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function useHoeOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  object.say(
    `Farmin' ain't easy.`
  );
}