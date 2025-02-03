import { SCENE_GAME } from "@game/scenes/game/scene";
import { SceneObject } from "@core/model/scene-object";
import { ChickenObject } from "@game/objects/chicken.object";
import { PlayerObject } from "@game/objects/player.object";
import { TreeStumpObject } from "@game/objects/tree-stump.object";
import { TreeObject } from "@game/objects/tree.object";
import { ChestObject } from "@game/objects/world-objects/chest.object";
import { useToolOnChest } from "../tool/use-tool-on-chest.action";
import { useAxeOnChicken } from "./use-axe-on-chicken.action";
import { useAxeOnTreeStump } from "./use-axe-on-tree-stump.action";
import { useAxeOnTree } from "./use-axe-on-tree.action";
import { ItemType } from "@game/models/inventory.model";

export function useAxe(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  switch(true){
    case target instanceof ChickenObject:
      useAxeOnChicken(scene, player, target);
      return;
    case target instanceof TreeObject:
      useAxeOnTree(scene, player, target);
      return;
    case target instanceof TreeStumpObject:
      useAxeOnTreeStump(scene, player, target);
      return;
    case target instanceof ChestObject:
      useToolOnChest(scene, player, target, ItemType.Axe);
      return;
    case target !== undefined:
      return;
  }
}