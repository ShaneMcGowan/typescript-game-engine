import { Input } from '@core/utils/input.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { ItemType, type ItemTypeFurnitureWall } from '@game/models/inventory.model';
import { assertUnreachable } from '@core/utils/typescript.utils';
import { FurniturePaintingObject } from '@game/objects/furniture/wall/furniture-painting.object';
import { FurnitureWallAreaObject } from '@game/objects/areas/furniture-wall.object';
import { FurnitureWallObject } from '@game/objects/furniture/furniture-wall.object';
import { FurnitureUtils } from '@game/utils/furniture.utils';

export function useFurnitureWall(scene: SCENE_GAME, type: ItemTypeFurnitureWall): void {
  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  // only place on wall area
  const hasFloorArea = FurnitureUtils.hasFloorArea(scene, x, y, FurnitureWallAreaObject);
  if (!hasFloorArea) {
    return;
  }

  // don't allow placing furniture floor objects on top of one another
  const hasObject = FurnitureUtils.hasObject(scene, x, y, FurnitureWallObject);
  if (hasObject) {
    return;
  }

  let object;
  switch (type) {
    case ItemType.FurniturePainting:
      object = new FurniturePaintingObject(scene, {});
      break;
    default:
      assertUnreachable(type);
  }

  object.transform.position.local.x = x;
  object.transform.position.local.y = y;

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}
