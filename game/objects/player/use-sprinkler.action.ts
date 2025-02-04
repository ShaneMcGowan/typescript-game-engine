import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { PlayerObject } from '@game/objects/player.object';
import { SceneObject } from "@core/model/scene-object";
import { SprinklerObject } from "../sprinkler.object";

export function useSprinkler(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  if(target){
    return;
  }

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new SprinklerObject(
    scene,
    {
      x: x,
      y: y,
    }
  );

  scene.addObject(object);

  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}