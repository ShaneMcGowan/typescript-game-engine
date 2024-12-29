import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function useAxeOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  object.say(
    `No thanks, I got a haircut last week.`
  );
}