import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function usePickaxeOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  object.say(
    `Ehh... do I look like a rock to you?`
  );
}