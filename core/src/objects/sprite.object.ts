import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { Assets } from '@core/utils/assets.utils';
import { RenderUtils } from '@core/utils/render.utils';

interface Config extends SceneObjectBaseConfig {
  tileset: string;
  spriteY: number;
  spriteX: number;
}

export class SpriteObject extends SceneObject {
  tileset: string;
  spriteX: number;
  spriteY: number;

  constructor(protected scene: Scene, config: Config) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;

    this.tileset = config.tileset;
    this.spriteX = config.spriteX;
    this.spriteY = config.spriteY;
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images['sprites'],
      this.spriteX,
      this.spriteY,
      this.transform.positionLocal.x,
      this.transform.positionLocal.y,
      this.width,
      this.height,
      { centered: true, }
    );
  }
}
