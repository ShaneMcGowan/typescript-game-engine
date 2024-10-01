import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { EggObject } from "@game/objects/egg.object";

export function useEgg(scene: SCENE_GAME): void {
  let position = Input.mouse.position;

  let newObject: EggObject = new EggObject(
    scene,
    {
      positionX: position.x,
      positionY: position.y
    }
  );

  scene.addObject(newObject);
  scene.removeFromInventory(scene.selectedInventoryIndex);
}