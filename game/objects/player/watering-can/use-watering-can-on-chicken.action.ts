import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";
import { Portrait, TextboxObject } from "@game/objects/textbox.object";

const PORTRAIT: Portrait = {
  tileset: 'tileset_chicken',
  x: 0,
  y: 0
}

export function useWateringCanOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  scene.globals.disable_player_inputs = true;

  scene.addObject(
    new TextboxObject(
      scene,
      {
        text: 'Hey could you not water me please...',
        portrait: PORTRAIT,
        name: 'Chicken',
        onComplete: () => {
          scene.globals.disable_player_inputs = false;
        },
      }
    )
  );
}