import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "@game/objects/textbox.object";

export function useSeed(scene: SCENE_GAME): void {
  scene.globals.disable_player_inputs = true;

  const object = new TextboxObject(
    scene,
    {
      text: 'Seeds can only be placed in watered dirt.',
      onComplete: () => {
        scene.globals.disable_player_inputs = false;
      },
    }
  )

  scene.addObject(object);
}