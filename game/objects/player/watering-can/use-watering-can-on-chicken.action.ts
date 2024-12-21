import { SCENE_GAME } from "@game/scenes/game/scene";
import { Portrait, TextboxObject } from "@game/objects/textbox.object";
import { ChickenObject } from "@game/objects/chicken.object";

const PORTRAIT: Portrait = {
  tileset: 'tileset_chicken',
  x: 0,
  y: 0
}

export function useWateringCanOnChicken(scene: SCENE_GAME, object: ChickenObject): void {
  scene.globals.player.enabled = false;

  const newObject = new TextboxObject(
    scene,
    {
      text: 'Hey could you not water me please...',
      portrait: PORTRAIT,
      name: 'Chicken',
      onComplete: () => {
        scene.globals.player.enabled = true;
      },
    }
  );

  scene.addObject(newObject);
}