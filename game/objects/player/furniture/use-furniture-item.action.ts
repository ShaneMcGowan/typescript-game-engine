import { Input } from '@core/utils/input.utils';
import { SavePoint, type SCENE_GAME } from '@game/scenes/game/scene';
import { ItemType, type ItemTypeFurnitureItem } from '@game/models/inventory.model';
import { assertUnreachable } from '@core/utils/typescript.utils';
import { FurnitureBedObject } from '@game/objects/furniture/item/furniture-bed.object';
import { FurnitureFloorAreaObject } from '@game/objects/areas/furniture-floor.object';
import { FurnitureItemObject } from '@game/objects/furniture/furniture-item.object';
import { FurnitureUtils } from '@game/utils/furniture.utils';
import { FurnitureTableObject } from '@game/objects/furniture/item/furniture-table.object';
import { FurnitureLampObject } from '@game/objects/furniture/item/furniture-lamp.object';

export function useFurnitureItem(scene: SCENE_GAME, type: ItemTypeFurnitureItem): void {
  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  // only place on floor area
  const hasFloorArea = FurnitureUtils.hasFloorArea(scene, x, y, FurnitureFloorAreaObject);
  if (!hasFloorArea) {
    return;
  }

  // don't allow placing furniture floor objects on top of one another
  const hasObject = FurnitureUtils.hasObject(scene, x, y, FurnitureItemObject);
  if (hasObject) {
    return;
  }

  let object;
  switch (type) {
    case ItemType.FurnitureBed:
      object = new FurnitureBedObject(scene, { savePoint: SavePoint.House, });
      break;
    case ItemType.FurnitureTable:
      object = new FurnitureTableObject(scene, {});
      break;
    case ItemType.FurnitureLamp:
      object = new FurnitureLampObject(scene, {});
      break;
    default:
      assertUnreachable(type);
  }

  object.transform.position.local.x = x;
  object.transform.position.local.y = y;

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}
