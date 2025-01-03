import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { Assets } from '@core/utils/assets.utils';
import { ButtonObject } from '../button.object';

interface Config extends SceneObjectBaseConfig {
}

export class StartButtonObject extends ButtonObject {

  width = 6;
  height = 2;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderStartButton(context);
  }

  private renderStartButton(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images.tileset_button,
      this.held ? 6 : 0, // sprite x
      2, // sprite y
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        centered: true
      }
    );
  }

}
