import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

interface Config extends SceneObjectBaseConfig {
  hexColourCode: string;
  renderLayer?: number;
}

export class FillObject extends SceneObject {
  constructor(protected scene: Scene, protected config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.layer = config.renderLayer ?? CanvasConstants.FIRST_UI_RENDER_LAYER;
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width * CanvasConstants.TILE_SIZE,
      this.height * CanvasConstants.TILE_SIZE,
      {
        colour: this.colour,
      }
    );
  }

  get colour(): string {
    return this.config.hexColourCode;
  }
}