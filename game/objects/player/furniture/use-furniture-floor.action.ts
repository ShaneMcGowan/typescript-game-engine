import { Input } from "@core/utils/input.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { ItemType, ItemTypeFurnitureFloor } from "@game/models/inventory.model";
import { assertUnreachable } from "@core/utils/typescript.utils";
import { FurnitureRugObject } from "@game/objects/furniture/floor/furniture-rug.object";
import { FurnitureFloorAreaObject } from "@game/objects/areas/furniture-floor.object";
import { FurnitureFloorObject } from "@game/objects/furniture/furniture-floor.object";
import { FurnitureUtils } from "@game/utils/furniture.utils";

export function useFurnitureFloor(scene: SCENE_GAME, type: ItemTypeFurnitureFloor): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  // only place on floor area
  const hasFloorArea = FurnitureUtils.hasFloorArea(scene, x,y ,FurnitureFloorAreaObject)
  if(!hasFloorArea){
    return;
  }

  // don't allow placing furniture floor objects on top of one another
  const hasObject = FurnitureUtils.hasObject(scene, x,y ,FurnitureFloorObject)
  if(hasObject){
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