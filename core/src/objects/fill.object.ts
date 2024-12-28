import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

const DEFAULT_HEX_COLOUR_CODE = '#00000099';

interface Config extends SceneObjectBaseConfig {
  hexColourCode?: string;
  renderLayer?: number;
}

export class FillObject extends SceneObject {
  constructor(protected scene: Scene, protected config: Config) {
    super(scene, config);

    this.collision.enabled = true;
    this.renderer.layer = config.renderLayer ?? CanvasConstants.FIRST_UI_RENDER_LAYER;
    this.renderer.enabled = true;

    if (config.width === undefined) {
      this.width = CanvasConstants.CANVAS_TILE_WIDTH;
    }
    if (config.height === undefined) {
      this.height = CanvasConstants.CANVAS_TILE_HEIGHT;
    }
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
    return this.config.hexColourCode ?? DEFAULT_HEX_COLOUR_CODE;
  }
}
