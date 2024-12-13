import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChestObject } from "../chest.object";

export function useChest(scene: SCENE_GAME): void {

  const x = Math.round(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.round(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new ChestObject(
    scene,
    {
      positionX: x,
      positionY: y,
    }
  );

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}