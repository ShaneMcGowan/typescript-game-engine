import { SCENE_GAME } from "@game/scenes/game/scene";
import { CropStage, DirtObject } from "@game/objects/dirt.object";
import { TextboxObject } from "@game/objects/textbox.object";

export function useSeedOnDirt(scene: SCENE_GAME, object: DirtObject): void {
  if (object.cropStage !== CropStage.Watered) {
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
    return;
  }


  object.actionPlant();
}