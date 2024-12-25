import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function useChicken(scene: SCENE_GAME): void {

  const x = Math.floor(Input.mouse.position.x + scene.screen.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.screen.camera.startY);

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