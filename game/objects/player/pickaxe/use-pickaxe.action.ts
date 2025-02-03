import { SCENE_GAME } from "@game/scenes/game/scene";
import { PlayerObject } from "@game/objects/player.object";
import { AnimationsPlayer } from "@game/constants/animations/player.animations";
import { SceneObject } from "@core/model/scene-object";
import { ChickenObject } from "@game/objects/chicken.object";
import { RockObject } from "@game/objects/rock.object";
import { ChestObject } from "@game/objects/world-objects/chest.object";
import { useToolOnChest } from "../tool/use-tool-on-chest.action";
import { usePickaxeOnChicken } from "./use-pickaxe-on-chicken.action";
import { usePickaxeOnRock } from "./use-pickaxe-on-rock.action";
import { ItemType } from "@game/models/inventory.model";
import { DirtObject } from "@game/objects/dirt.object";
import { usePickaxeOnDirt } from "./use-pickaxe-on-dirt.action";

export function usePickaxe(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  switch(true){
    case target instanceof ChickenObject:
      usePickaxeOnChicken(scene, player, target);
      return;
    case target instanceof RockObject:
      usePickaxeOnRock(scene, player, target);
      return;
    case target instanceof ChestObject:
      useToolOnChest(scene, player, target, ItemType.Pickaxe);
      return;
    case target instanceof DirtObject:
      usePickaxeOnDirt(scene, player, target);
      return;
    case target !== undefined:
      player.startAnimation(
        AnimationsPlayer.UsePickaxe[player.direction],
      );
      return;
  }

  player.startAnimation(
    AnimationsPlayer.UsePickaxe[player.direction],
  );
}