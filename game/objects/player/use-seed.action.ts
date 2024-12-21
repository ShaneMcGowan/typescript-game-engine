import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "@game/objects/textbox.object";

export function useSeed(scene: SCENE_GAME): void {
  scene.globals.player.actionsEnabled = false;

  const object = new TextboxObject(
    scene,
    {
      text: 'Seeds can only be placed in watered dirt.',
      onComplete: () => {
        scene.globals.player.actionsEnabled = true;
      },
    }
  )

  scene.addObject(object);
}