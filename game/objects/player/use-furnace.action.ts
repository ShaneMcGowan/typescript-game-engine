import { type SceneObject } from "@core/model/scene-object";
import { Input } from "@core/utils/input.utils";
import { type SCENE_GAME } from "@game/scenes/game/scene";
import { type PlayerObject } from "../player.object";
import { FurnaceObject } from "../furnace.object";

export function useFurnace(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  if (target) {
    return;
  }

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new FurnaceObject(
    scene,
    {
      x,
      y,
    }
  );

  scene.addObject(object);

  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}
