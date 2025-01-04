import { SCENE_GAME } from "@game/scenes/game/scene";
import { MessageUtils } from "@game/utils/message.utils";

export function useWateringCan(scene: SCENE_GAME): void {
  MessageUtils.showMessage(
    scene, 
    `There is nothing to water...`
  );
}