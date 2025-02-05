import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { DeviceType } from '@core/model/device-type';
import { IconMenuObject } from './icon-menu.object';
import { IconInventoryObject } from './icon-inventory.object';
import { IconDebugNewDayObject } from './icon-debug-new-day.object';
import { IconDebugNewSeasonObject } from './icon-debug-new-season.object';

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
      new IconMenuObject(this.scene, { x, }),
      new IconInventoryObject(this.scene, { x, }),
      ...(CanvasConstants.DEBUG_MODE ? [new IconDebugNewDayObject(this.scene, { x, })] : []),
      ...(CanvasConstants.DEBUG_MODE ? [new IconDebugNewSeasonObject(this.scene, { x, })] : [])
    ];

    icons.forEach((icon, index) => {
      icon.transform.position.local.y = y + (index * yPadding);
      this.scene.addObject(icon);
    });
  }
}
