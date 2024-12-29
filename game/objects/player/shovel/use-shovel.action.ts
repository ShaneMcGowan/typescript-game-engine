import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";
import { Input } from "@core/utils/input.utils";
import { HoleObject } from "@game/objects/hole.object";

export function useShovel(scene: SCENE_GAME): void {

  const x = Math.floor(Input.mouse.position.x + scene.globals.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.globals.camera.startY);

  const object = new HoleObject(
    scene,
    {
      positionX: x,
      positionY: y,
    }
  );

  scene.addObject(object);
}