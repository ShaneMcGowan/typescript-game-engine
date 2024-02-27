import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@utils/render.utils';

interface Config extends SceneObjectBaseConfig {
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  tileset: string;
  spriteY: number;
  spriteX: number;
}

export class SpriteObject extends SceneObject {
  isRenderable = true;
  hasCollision = false;

  tileset: string;
  spriteX: number;
  spriteY: number;

  constructor(protected scene: Scene, config: Config) {
    super(scene, config);

    this.width = config.width;
    this.height = config.height;
    this.tileset = config.tileset;
    this.spriteX = config.spriteX;
    this.spriteY = config.spriteY;
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images['sprites'],
      this.spriteX,
      this.spriteY,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
  }
}
