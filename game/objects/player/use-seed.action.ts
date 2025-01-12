import { SCENE_GAME } from "@game/scenes/game/scene";
import { SceneObject } from "@core/model/scene-object";
import { MessageUtils } from "@game/utils/message.utils";
import { DirtObject } from "../dirt.object";
import { useSeedOnDirt } from "./seed/use-seed-on-dirt.action";
import { PlayerObject } from "../player.object";

export function useSeed(scene: SCENE_GAME, player: PlayerObject, target?: SceneObject): void {
  switch (true) {
    case target instanceof DirtObject:
      useSeedOnDirt(scene, target);
      return;
  }

  MessageUtils.showMessage(
    scene,
    `Seeds can only be placed in watered dirt.`
  );
}