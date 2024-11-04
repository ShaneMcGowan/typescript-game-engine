import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';

const TILESET = 'tileset_plants';
const DEFAULT_RENDER_LAYER = 7;

interface Config extends SceneObjectBaseConfig {

}

export class SeedsObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  spriteX: number = 0;
  spriteY: number = 0;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.scene.assets.images[TILESET],
      this.spriteX,
      this.spriteY,
      this.transform.position.x,
      this.transform.position.y
    );
  }
}
