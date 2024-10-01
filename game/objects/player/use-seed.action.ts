import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "@game/objects/textbox.object";

export function useSeed(scene: SCENE_GAME): void {
  scene.globals.disable_player_inputs = true;

  scene.addObject(
    new TextboxObject(
      scene,
      {
        text: 'Seeds can only be placed in dirt.',
        onComplete: () => {
          scene.globals.disable_player_inputs = false;
        },
      }
    )
  );
}