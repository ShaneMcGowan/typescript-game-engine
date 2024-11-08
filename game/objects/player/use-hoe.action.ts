import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";
import { PlayerObject } from "../player.object";
import { Input } from "@core/utils/input.utils";

export function useHoe(scene: SCENE_GAME, player: PlayerObject): void {

  const playerX = Math.floor(player.positionX);
  const playerY = Math.floor(player.positionY);
  const mouseX = Input.mouse.position.x;
  const mouseY = Input.mouse.position.y;

  console.log({
    x: Math.abs(mouseX - playerX),
    y: Math.abs(mouseY - playerY)
  })

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