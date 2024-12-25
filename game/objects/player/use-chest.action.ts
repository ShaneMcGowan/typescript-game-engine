import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChestObject } from "../chest.object";

export function useChest(scene: SCENE_GAME): void {

  const x = Math.floor(Input.mouse.position.x + scene.screen.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.screen.camera.startY);

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