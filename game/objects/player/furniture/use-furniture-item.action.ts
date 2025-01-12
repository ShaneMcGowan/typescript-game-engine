import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ItemType, ItemTypeFurnitureItem } from "@game/models/inventory.model";
import { assertUnreachable } from "@core/utils/typescript.utils";
import { FurnitureBedObject } from "@game/objects/furniture/furniture-bed.object";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { ObjectFilter } from "@core/model/scene";
import { SceneObject } from "@core/model/scene-object";
import { FurnitureFloorAreaObject } from "@game/objects/areas/furniture-floor.object";

export function useFurnitureItem(scene: SCENE_GAME, type: ItemTypeFurnitureItem): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const filter: ObjectFilter = {
    boundingBox: SceneObject.calculateBoundingBox(
      x,
      y,
      CanvasConstants.TILE_PIXEL_SIZE,
      CanvasConstants.TILE_PIXEL_SIZE,
    ),
    typeMatch: [FurnitureFloorAreaObject]
  }
  const object = scene.getObject(filter);
  // only place on floor area
  if(object === undefined){
    return;
  }

  let furnitureObject;

  switch(type){
    case ItemType.FurnitureBed:
      furnitureObject = new FurnitureBedObject(scene, {});
      break;
    default:
      assertUnreachable(type)
  }

  furnitureObject.transform.position.local.x = x;
  furnitureObject.transform.position.local.y = y;

  scene.addObject(furnitureObject);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}