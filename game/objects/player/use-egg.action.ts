import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { EggObject } from "@game/objects/egg.object";
import { SceneObject } from "@core/model/scene-object";
import { PlayerObject } from "../player.object";

export function useEgg(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new EggObject(
    scene,
    {
      x: x,
      y: y
    }
  );

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}