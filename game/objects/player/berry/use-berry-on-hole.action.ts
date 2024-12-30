import { SCENE_GAME } from "@game/scenes/game/scene";
import { HoleObject } from "@game/objects/hole.object";
import { ItemType } from "@game/models/inventory.model";
import { TreeObject } from "@game/objects/tree.object";

/**
 * Plant berry
 * @param scene 
 * @param object 
 */
export function useBerryOnHole(scene: SCENE_GAME, object: HoleObject): void {
  // remove berry
  scene.globals.inventory.removeItems(ItemType.Berry, 1);

  // remove hole
  object.destroy();

  // add tree
  // TODO: update this later once growing tree is created
  const tree = new TreeObject(
    scene,
    {
      positionX: object.transform.position.world.x,
      positionY: object.transform.position.world.y,
      type: 'big',
    }
  );

  scene.addObject(tree);
}