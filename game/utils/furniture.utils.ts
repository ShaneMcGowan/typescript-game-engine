import { CanvasConstants } from "@core/constants/canvas.constants";
import { ObjectFilter } from "@core/model/scene";
import { SceneObject } from "@core/model/scene-object";
import { ItemType, ItemTypeFurnitureFloors, ItemTypeFurnitureItems, ItemTypeFurnitures, ItemTypeFurnitureWalls } from "@game/models/inventory.model";
import { FurnitureFloorAreaObject } from "@game/objects/areas/furniture-floor.object";
import { FurnitureWallAreaObject } from "@game/objects/areas/furniture-wall.object";
import { FurnitureFloorObject } from "@game/objects/furniture/furniture-floor.object";
import { FurnitureItemObject } from "@game/objects/furniture/furniture-item.object";
import { FurnitureWallObject } from "@game/objects/furniture/furniture-wall.object";
import { SCENE_GAME } from "@game/scenes/game/scene";

const COLOUR_CURSOR_VALID: string = '#00FF0033';
const COLOUR_CURSOR_INVALID: string = '#FF000033';

export class FurnitureUtils {

  static hasFloorArea(
    scene: SCENE_GAME, 
    x: number, 
    y: number,
    objectType: (typeof FurnitureFloorAreaObject | typeof FurnitureWallAreaObject)
  ): boolean{
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        x,
        y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      ),
      typeMatch: [objectType]
    }

    return scene.getObject(filter) !== undefined;  
  }

  static hasObject(
    scene: SCENE_GAME, 
    x: number, 
    y: number, 
    objectType: (typeof FurnitureFloorObject | typeof FurnitureItemObject | typeof FurnitureWallObject)
  ): boolean {
    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        x,
        y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      ),
      typeMatch: [objectType]
    }
    return scene.getObject(filter) !== undefined;
  }

  static cursor(
    scene: SCENE_GAME, 
    x: number, 
    y: number,
    type: ItemType
  ): string | undefined {
    
    if(!ItemTypeFurnitures.includes(type)){
      return undefined;
    }

    let hasFloorArea = false;
    let hasObject = true;

    // floors
    if(ItemTypeFurnitureFloors.includes(type)){
      hasFloorArea = this.hasFloorArea(scene, x, y, FurnitureFloorAreaObject);
      hasObject = this.hasObject(scene, x, y, FurnitureFloorObject);
    }

    // walls
    if(ItemTypeFurnitureWalls.includes(type)){
      hasFloorArea = this.hasFloorArea(scene, x, y, FurnitureWallAreaObject);
      hasObject = this.hasObject(scene, x, y, FurnitureWallObject);
    }

    // items
    if(ItemTypeFurnitureItems.includes(type)){
      hasFloorArea = this.hasFloorArea(scene, x, y, FurnitureFloorAreaObject);
      hasObject = this.hasObject(scene, x, y, FurnitureItemObject);
    }

    if(hasFloorArea && !hasObject){
      return COLOUR_CURSOR_VALID;
    } else {
      return COLOUR_CURSOR_INVALID;
    }
  }

}