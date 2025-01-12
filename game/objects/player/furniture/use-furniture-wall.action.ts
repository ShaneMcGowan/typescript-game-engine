import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { Inventory, ItemType, ItemTypeFurnitureWall } from "@game/models/inventory.model";
import { assertUnreachable } from "@core/utils/typescript.utils";
import { FurniturePaintingObject } from "@game/objects/furniture/furniture-painting.object";
import { ObjectFilter } from "@core/model/scene";
import { SceneObject } from "@core/model/scene-object";
import { CanvasConstants } from "@core/constants/canvas.constants";
import { FurnitureWallAreaObject } from "@game/objects/areas/furniture-wall.object";
import { MessageUtils } from "@game/utils/message.utils";
import { FurnitureFloorObject } from "@game/objects/furniture/furniture-floor.object";
import { FurnitureWallObject } from "@game/objects/furniture/furniture-wall.object";

export function useFurnitureWall(scene: SCENE_GAME, type: ItemTypeFurnitureWall): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const filterArea: ObjectFilter = {
    boundingBox: SceneObject.calculateBoundingBox(
      x,
      y,
      CanvasConstants.TILE_PIXEL_SIZE,
      CanvasConstants.TILE_PIXEL_SIZE,
    ),
    typeMatch: [FurnitureWallAreaObject]
  }
  const area = scene.getObject(filterArea);
  // only place on wall area
  if(area === undefined){
    MessageUtils.showMessage(
      scene,
      `${Inventory.getItemName(type, true)} must be placed on a wall.`
    );
    return;
  }

  // don't allow placing furniture wall objects on top of one another
  const filterFurnitureWall: ObjectFilter = {
    boundingBox: SceneObject.calculateBoundingBox(
      x,
      y,
      CanvasConstants.TILE_PIXEL_SIZE,
      CanvasConstants.TILE_PIXEL_SIZE,
    ),
    typeMatch: [FurnitureWallObject]
  }
  const furnitureWall = scene.getObject(filterFurnitureWall);
  if(furnitureWall){
    return;
  }

  let object;
  switch(type){
    case ItemType.FurniturePainting:
      object = new FurniturePaintingObject(scene, {});
      break;
    default:
      assertUnreachable(type)
  }

  object.transform.position.local.x = x;
  object.transform.position.local.y = y;

  scene.addObject(object);
  scene.globals.inventory.removeFromInventoryByIndex(scene.selectedInventoryIndex, 1);
}