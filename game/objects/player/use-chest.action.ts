import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChestObject } from "../chest.object";

export function useChest(scene: SCENE_GAME): void {

  const mouseX = Input.mouse.position.x;
  const mouseY = Input.mouse.position.y;

  const object = new ChestObject(
    scene,
    {
      positionX: mouseX,
      positionY: mouseY,
    }
  );

  scene.addObject(object);
  scene.removeFromInventory(scene.selectedInventoryIndex);
}