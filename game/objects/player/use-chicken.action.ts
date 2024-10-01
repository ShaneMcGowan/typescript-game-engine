import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";

export function useChicken(scene: SCENE_GAME): void {
  let position = Input.mouse.position;

  let newObject: ChickenObject = new ChickenObject(
    scene,
    {
      positionX: position.x,
      positionY: position.y
    }
  );

  scene.addObject(newObject);
  scene.removeFromInventory(scene.selectedInventoryIndex);
}