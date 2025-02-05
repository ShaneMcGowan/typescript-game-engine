import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';

interface Config extends SceneObjectBaseConfig {
}

/**
 * Used to define areas of interaction etc
 */
export abstract class AreaObject extends SceneObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
  }

  get colour(): string {
    return '#FFFFFF';
  }

  onRender(context: CanvasRenderingContext2D): void {
    if (!CanvasConstants.DEBUG_MODE) {
      return;
    }

    RenderUtils.fillRectangle(
      context,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        colour: this.colour,
        type: 'tile',
      }
    );
  }
}
