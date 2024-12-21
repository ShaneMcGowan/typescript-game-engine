import { SCENE_GAME } from "@game/scenes/game/scene";
import { TextboxObject } from "@game/objects/textbox.object";

export function useWateringCan(scene: SCENE_GAME): void {
  scene.globals.player.actionsEnabled = false;

  const object = new TextboxObject(
    scene,
    {
      text: 'There is nothing to water...',
      onComplete: () => {
        scene.globals.player.actionsEnabled = true;
      },
    }
  );

  scene.addObject(object);
}