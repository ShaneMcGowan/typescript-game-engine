import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { EggObject } from "@game/objects/egg.object";

export function useEgg(scene: SCENE_GAME): void {

  const mouseX = Math.round(Input.mouse.position.exactX + scene.globals.camera.startX);
  const mouseY = Math.round(Input.mouse.position.exactY + scene.globals.camera.startY);

  let object: EggObject = new EggObject(
    scene,
    {
      positionX: mouseX,
      positionY: mouseY
    }
  );

  scene.addObject(object);
  scene.removeFromInventory(scene.selectedInventoryIndex);
}