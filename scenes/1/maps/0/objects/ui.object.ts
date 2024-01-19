import { CanvasConstants } from '@constants/canvas.constants';
import { type Scene } from '@model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { RenderUtils } from '@utils/render.utils';

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;

interface Config extends SceneObjectBaseConfig {

}

export class UiObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderInventory(context);
  }

  renderInventory(context: CanvasRenderingContext2D): void {
    // containers
    for (let i = 0; i < 9; i++) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.tileset_ui,
        0.5,
        3.5,
        this.positionX + (i * 2),
        this.positionY,
        2,
        2
      );
    }

    // items
    for (let i = 0; i < this.totalEggs; i++) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.tileset_egg,
        0,
        0,
        this.positionX + 0.5 + (i * 2),
        this.positionY + 0.5
      );
    }
  }

  get totalEggs(): number {
    return this.scene.globals.total_eggs;
  }
}
