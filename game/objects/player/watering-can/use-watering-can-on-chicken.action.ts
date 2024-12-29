import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function useWateringCanOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  object.say(
    `No need to water me, I moisturise every morning. I have a very thorough skincare routine.`
  );
}