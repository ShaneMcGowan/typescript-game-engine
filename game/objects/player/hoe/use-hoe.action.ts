import { type SCENE_GAME } from '@game/scenes/game/scene';
import { DirtObject } from '@game/objects/dirt.object';
import { Input } from '@core/utils/input.utils';
import { type PlayerObject } from '../../player.object';
import { AnimationsPlayer, type PlayerActionAnimationCallback } from '@game/constants/animations/player.animations';
import { FarmingUtils } from '@game/utils/farming.utils';
import { type SceneObject } from '@core/model/scene-object';
import { ItemType } from '@game/models/inventory.model';
import { ChickenObject } from '@game/objects/chicken.object';
import { ChestObject } from '@game/objects/world-objects/chest.object';
import { useToolOnChest } from '../tool/use-tool-on-chest.action';
import { useHoeOnChicken } from './use-hoe-on-chicken.action';

export function useHoe(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  switch (true) {
    case target instanceof ChickenObject:
      useHoeOnChicken(scene, player, target);
      return;
    case target instanceof ChestObject:
      useToolOnChest(scene, player, target, ItemType.Hoe);
      return;
    case target !== undefined:
      return;
  }

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const isFarmable = FarmingUtils.isPositionFarmable(scene, x, y);

  const callback: PlayerActionAnimationCallback = () => {
    const object = new DirtObject(
      scene,
      {
        x,
        y,
      }
    );

    scene.addObject(object);
  };

  player.startAnimation(
    AnimationsPlayer.UseHoe[player.direction],
    isFarmable ? callback : undefined
  );
}
