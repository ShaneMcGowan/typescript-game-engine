import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';

interface Config extends SceneObjectBaseConfig {
}

/**
 * An object that can be extended by UI objects for use with ObjectFilter
 */
export class UiObject extends SceneObject {
  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
    this.collision.layer = CanvasConstants.UI_COLLISION_LAYER;
  }
}
