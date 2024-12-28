import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "@game/objects/textbox.object";
import { ChickenObject } from "@game/objects/chicken.object";
import { SCENE_GAME_MAP_WORLD_TEXT } from "@game/constants/world-text.constants";

export function useAxeOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  scene.globals.player.enabled = false;

  const newObject = new TextboxObject(
    scene,
    {
      name: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.name,
      portrait: SCENE_GAME_MAP_WORLD_TEXT.npcs.chicken.details.portrait,
      text: `I would really appreciate it if you didn't do that.`,
      onComplete: () => {
        scene.globals.player.enabled = true;
      },
    }
  );

  scene.addObject(newObject);
}