import { SceneObject } from "@core/model/scene-object";
import { AnimationsPlayer } from "@game/constants/animations/player.animations";
import { PlayerObject } from "@game/objects/player.object";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { useWateringCanOnDirt } from "./use-watering-can-on-dirt.action";
import { ChickenObject } from "@game/objects/chicken.object";
import { DirtObject } from "@game/objects/dirt.object";
import { useWateringCanOnChicken } from "./use-watering-can-on-chicken.action";

export function useWateringCan(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {  
  switch (true) {
    case target instanceof DirtObject:
      useWateringCanOnDirt(scene, player, target);
      return;
    case target instanceof ChickenObject:
      useWateringCanOnChicken(scene, player, target);
      return;        
  }

  player.startAnimation(
    AnimationsPlayer.UseWateringCan[player.direction],
  );
}