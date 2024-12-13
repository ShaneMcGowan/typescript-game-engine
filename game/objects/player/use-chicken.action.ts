import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function useChicken(scene: SCENE_GAME): void {

  const x = Math.round(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.round(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new ChickenObject(
    scene,
    {
      positionX: x,
      positionY: y
    }
  );

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}