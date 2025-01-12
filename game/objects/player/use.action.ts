import { SCENE_GAME } from "@game/scenes/game/scene";
import { PlayerObject } from '@game/objects/player.object';
import { SceneObject } from "@core/model/scene-object";
import { FurnitureObject } from "../furniture/furniture.object";

export function use(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  if(target instanceof FurnitureObject){
    target.destroy();
    scene.globals.inventory.addToInventory(target.type);
    return;
  }
}