import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { MouseUtils } from '@core/utils/mouse.utils';
import { RenderUtils } from '@core/utils/render.utils';

export interface FullscreenToggleObjectConfig extends SceneObjectBaseConfig {
}

export class FullscreenToggleObject extends SceneObject {
  constructor(
    protected scene: Scene,
    config: SceneObjectBaseConfig
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
  }

  onUpdate(delta: number): void {
    if (!MouseUtils.wasObjectClicked(this)) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    // fullscreen enabled
    if (document.fullscreenElement || document.webkitIsFullScreen) {
      document.exitFullscreen();
    } else {
      this.scene.displayContext.canvas.requestFullscreen()
        .then(() => {
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images['tileset_fullscreen'],
      this.isFullscreen ? 1 : 0,
      0,
      this.boundingBox.world.left,
      this.boundingBox.world.top
    );
  }

  private get isFullscreen(): boolean {
    if (document.fullscreenElement || document.webkitIsFullScreen) {
      return true;
    }

    return false;
  }
}
