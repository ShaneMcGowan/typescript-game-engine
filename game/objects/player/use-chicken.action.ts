import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChickenObject } from "@game/objects/chicken.object";
import { PlayerObject } from "../player.object";
import { SceneObject } from "@core/model/scene-object";

export function useChicken(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new ChickenObject(
    scene,
    {
      x: x,
      y: y
    }
  );

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}