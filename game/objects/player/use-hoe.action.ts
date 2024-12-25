import { SCENE_GAME } from "@game/scenes/game/scene";
import { DirtObject } from "@game/objects/dirt.object";
import { Input } from "@core/utils/input.utils";

export function useHoe(scene: SCENE_GAME): void {

  const x = Math.floor(Input.mouse.position.x + scene.screen.camera.startX);
  const y = Math.floor(Input.mouse.position.y + scene.screen.camera.startY);

  const object = new DirtObject(
    scene,
    {
      positionX: x,
      positionY: y,
    }
  );

  scene.addObject(object);
}