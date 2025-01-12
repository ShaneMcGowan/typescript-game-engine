import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { Inventory, ItemType, ItemTypeFurnitureFloor, ItemTypeFurnitureItem } from "@game/models/inventory.model";
import { assertUnreachable } from "@core/utils/typescript.utils";
import { FurnitureRugObject } from "@game/objects/furniture/furniture-rug.object";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { ObjectFilter } from "@core/model/scene";
import { SceneObject } from "@core/model/scene-object";
import { FurnitureFloorAreaObject } from "@game/objects/areas/furniture-floor.object";
import { MessageUtils } from "@game/utils/message.utils";
import { FurnitureFloorObject } from "@game/objects/furniture/furniture-floor.object";

export function useFurnitureFloor(scene: SCENE_GAME, type: ItemTypeFurnitureFloor): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

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
  // only place on floor area
  if(area === undefined){
    MessageUtils.showMessage(
      scene,
      `${Inventory.getItemName(type, true)} must be placed on the floor.`
    );
    return;
  }

  // don't allow placing furniture floor objects on top of one another
  const filterFurnitureFloor: ObjectFilter = {
    boundingBox: SceneObject.calculateBoundingBox(
      x,
      y,
      CanvasConstants.TILE_PIXEL_SIZE,
      CanvasConstants.TILE_PIXEL_SIZE,
    ),
    typeMatch: [FurnitureFloorObject]
  }
  const furnitureFloor = scene.getObject(filterFurnitureFloor);
  if(furnitureFloor){
    return;
  }

  let object;
  switch(type){
    case ItemType.FurnitureRugLarge:
      object = new FurnitureRugObject(scene, {});
      break;
    default:
      assertUnreachable(type)
  }

  object.transform.position.local.x = x;
  object.transform.position.local.y = y;

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}