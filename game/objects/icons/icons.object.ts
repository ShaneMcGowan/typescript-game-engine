import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { DeviceType } from "@core/model/device-type";
import { IconMenuObject } from "./icon-menu.object";
import { IconInventoryObject } from "./icon-inventory.object";

interface Config extends SceneObjectBaseConfig {}

export class IconsObject extends SceneObject {

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  onAwake(): void {

    const x = CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? CanvasConstants.CANVAS_TILE_WIDTH - 2 : CanvasConstants.CANVAS_TILE_WIDTH - 1.5;
    const y = CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? 1 : 0.5;
    const yPadding = CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? 2 : 1.5; // gap between icons

    const icons = [
      new IconMenuObject(this.scene, { x: x, }),
      new IconInventoryObject(this.scene, { x: x }),
    ];

    icons.forEach((icon, index) => {
      icon.transform.position.local.y = y + (index * yPadding);
      this.scene.addObject(icon);
    });
  }
}