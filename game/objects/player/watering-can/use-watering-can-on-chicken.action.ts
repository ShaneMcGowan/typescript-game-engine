import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";
import { TextboxObject } from "@game/objects/textbox.object";

export function useWateringCanOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  scene.globals.disable_player_inputs = true;

  scene.addObject(
    new TextboxObject(
      scene,
      {
        text: 'Hey could you not water me please...',
        portrait: 'Chicken',
        name: 'Chicken',
        onComplete: () => {
          scene.globals.disable_player_inputs = false;
        },
      }
    )
  );
}