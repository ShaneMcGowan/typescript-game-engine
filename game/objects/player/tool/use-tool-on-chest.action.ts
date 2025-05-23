import { type SCENE_GAME } from '@game/scenes/game/scene';
import { ItemObject } from '@game/objects/item.object';
import { ItemType } from '@game/models/inventory.model';
import { type PlayerObject } from '@game/objects/player.object';
import { AnimationsPlayer, type PlayerActionAnimation, type PlayerActionAnimationCallback } from '@game/constants/animations/player.animations';
import { MovementUtils } from '@core/utils/movement.utils';
import { type ObjectFilter } from '@core/model/scene';
import { SceneObject } from '@core/model/scene-object';
import { UiObject } from '@core/objects/ui.object';
import { AreaObject } from '@game/objects/areas/area.object';
import { type ChestObject } from '@game/objects/world-objects/chest.object';

type Tool = ItemType.Axe | ItemType.Pickaxe | ItemType.Hoe;

export function useToolOnChest(scene: SCENE_GAME, player: PlayerObject, object: ChestObject, tool: Tool): void {
  const callback: PlayerActionAnimationCallback = () => {
    if (object.inventory.hasItems) {
      // chest not empty - try move
      const relative = MovementUtils.RelativePosition(
        player, object, 1
      );

      // check if can move in direction
      const filter: ObjectFilter = {
        boundingBox: SceneObject.calculateBoundingBox(
          object.transform.position.world.x + relative.x,
          object.transform.position.world.y + relative.y,
          object.width,
          object.height
        ),
        collision: {
          enabled: true,
        },
        typeIgnore: [UiObject, AreaObject],
      };

      const collisionObject = scene.getObject(filter);
      if (collisionObject !== undefined) {
        // object in the way, don't move
        return;
      }

      object.transform.position.local.x += relative.x;
      object.transform.position.local.y += relative.y;
      return;
    }

    // chest empty - destroy it
    object.destroy();

    scene.addObject(new ItemObject(
      scene,
      {
        type: ItemType.Chest,
        x: object.transform.position.world.x,
        y: object.transform.position.world.y,
      }
    ));
  };

  let animation: PlayerActionAnimation;
  switch (tool) {
    case ItemType.Axe:
      animation = AnimationsPlayer.UseAxe;
      break;
    case ItemType.Pickaxe:
      animation = AnimationsPlayer.UsePickaxe;
      break;
    case ItemType.Hoe:
      animation = AnimationsPlayer.UseHoe;
      break;
    default:
      break;
  }

  player.startAnimation(
    animation[player.direction],
    callback
  );
}
