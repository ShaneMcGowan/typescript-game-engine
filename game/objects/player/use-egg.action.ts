import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { EggObject } from "@game/objects/egg.object";

export function useEgg(scene: SCENE_GAME): void {

  const x = Math.floor(Input.mouse.position.x + scene.screen.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.screen.camera.startY);

  const object = new EggObject(
    scene,
    {
      positionX: x,
      positionY: y
    }
  );

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}