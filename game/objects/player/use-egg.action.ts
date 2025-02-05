import { Input } from '@core/utils/input.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { EggObject } from '@game/objects/egg.object';
import { type SceneObject } from '@core/model/scene-object';
import { type PlayerObject } from '../player.object';

export function useEgg(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new EggObject(
    scene,
    {
      x,
      y,
    }
  );

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}
