import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Assets } from '@core/utils/assets.utils';

const TILESET = 'tileset_plants';
const RENDERER_LAYER = 7;

interface Config extends SceneObjectBaseConfig {

}

export class SeedsObject extends SceneObject {
  spriteX: number = 0;
  spriteY: number = 0;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = RENDERER_LAYER;
  }

  onRender(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TILESET],
      this.spriteX,
      this.spriteY,
      this.transform.position.world.x,
      this.transform.position.world.y
    );
  }
}
