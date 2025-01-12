import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ChestObject } from '@game/objects/world-objects/chest.object';
import { PlayerObject } from '@game/objects/player.object';
import { SceneObject } from "@core/model/scene-object";

export function useChest(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new ChestObject(
    scene,
    {
      x: x,
      y: y,
      player: player,
    }
  );

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}