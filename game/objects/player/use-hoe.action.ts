import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";
import { PlayerObject } from "../player.object";
import { Input } from "@core/utils/input.utils";

export function useHoe(scene: SCENE_GAME, player: PlayerObject): void {

  const playerX = Math.round(player.transform.position.x);
  const playerY = Math.round(player.transform.position.y);

  const mouseX = Math.round(Input.mouse.position.exactX + scene.globals.camera.startX);
  const mouseY = Math.round(Input.mouse.position.exactY + scene.globals.camera.startY);

  // don't perform action if player is clicking greater than 1 tile away
  if (Math.abs(mouseX - playerX) > 1 || Math.abs(mouseY - playerY) > 1) {
    return;
  }

  const object = new DirtObject(
    scene,
    {
      positionX: mouseX,
      positionY: mouseY,
    }
  );

  scene.addObject(object);
}