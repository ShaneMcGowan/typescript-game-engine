import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { Inventory, ItemType, ItemTypeFurnitureItem } from "@game/models/inventory.model";
import { assertUnreachable } from "@core/utils/typescript.utils";
import { FurnitureBedObject } from "@game/objects/furniture/furniture-bed.object";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { ObjectFilter } from "@core/model/scene";
import { SceneObject } from "@core/model/scene-object";
import { FurnitureFloorAreaObject } from "@game/objects/areas/furniture-floor.object";
import { MessageUtils } from "@game/utils/message.utils";
import { FurnitureItemObject } from "@game/objects/furniture/furniture-item.object";

export function useFurnitureItem(scene: SCENE_GAME, type: ItemTypeFurnitureItem): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  // only place on floor area
  const filterArea: ObjectFilter = {
    boundingBox: SceneObject.calculateBoundingBox(
      x,
      y,
      CanvasConstants.TILE_PIXEL_SIZE,
      CanvasConstants.TILE_PIXEL_SIZE,
    ),
    typeMatch: [FurnitureFloorAreaObject]
  }
  const area = scene.getObject(filterArea);
  if(area === undefined){
    MessageUtils.showMessage(
      scene,
      `${Inventory.getItemName(type, true)} must be placed on the floor.`
    );
    return;
  }

  // don't allow placing furniture items on top of one another
  const filterFurnitureItem: ObjectFilter = {
    boundingBox: SceneObject.calculateBoundingBox(
      x,
      y,
      CanvasConstants.TILE_PIXEL_SIZE,
      CanvasConstants.TILE_PIXEL_SIZE,
    ),
    typeMatch: [FurnitureItemObject]
  }
  const furnitureItem = scene.getObject(filterFurnitureItem);
  if(furnitureItem){
    return;
  }

  let object;
  switch(type){
    case ItemType.FurnitureBed:
      object = new FurnitureBedObject(scene, {});
      break;
    default:
      assertUnreachable(type)
  }

  object.transform.position.local.x = x;
  object.transform.position.local.y = y;

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}