import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SAMPLE_SCENE_1 } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';

const TILESET = 'tileset_plants';
const DEFAULT_RENDER_LAYER = 7;

interface Config extends SceneObjectBaseConfig {

}

export class SeedsObject extends SceneObject {
  hasCollision = false;
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  spriteX: number = 0;
  spriteY: number = 0;

  constructor(protected scene: SAMPLE_SCENE_1, config: Config) {
    super(scene, config);
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.scene.assets.images[TILESET],
      this.spriteX,
      this.spriteY,
      this.positionX,
      this.positionY
    );
  }
}
