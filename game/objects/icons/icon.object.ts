import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { MouseUtils } from '@core/utils/mouse.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MenuObject } from '../menu/menu.object';
import { UiObject } from '@core/objects/ui.object';
import { ItemSprite } from '@game/models/inventory.model';

interface Config extends SceneObjectBaseConfig {
}

export class IconObject extends UiObject {
  width: number = 1;
  height: number = 1;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
  }

  onUpdate(delta: number): void {
    this.updateOnClick();
  }

  get enabled(): boolean {
    return this.scene.globals.player.enabled;
  }

  private updateOnClick(): void {
    if (!this.enabled) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    if (!Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    this.onClick();
  }

  onClick(): void {

  }
}
