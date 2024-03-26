import { CanvasConstants } from '@core/src/constants/canvas.constants';
import { type Scene } from '@core/src/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/src/model/scene-object';
import { RenderUtils } from '@core/src/utils/render.utils';
import { NUMBER_SPRITES_MEDIUM } from '../constants/sprite.constants';

interface Config extends SceneObjectBaseConfig {
  score: number;
}

export class TextObject extends SceneObject {
  isRenderable = true;
  renderLayer = CanvasConstants.UI_COLLISION_LAYER;

  score: number;

  constructor(protected scene: Scene, config: Config) {
    super(scene, config);

    this.score = config.score;
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderScore(context);
  }

  private renderScore(context: CanvasRenderingContext2D): void {
    let score = this.score.toString().split('');

    let positionX = this.positionX;

    let spriteWidth = 0.5;
    let xOffset = 0.0625;
    let spriteHeight = 0.75;

    let start = (score.length - 1) * (spriteWidth + xOffset);

    score.forEach((digit, index) => {
      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        NUMBER_SPRITES_MEDIUM[digit].spriteX,
        NUMBER_SPRITES_MEDIUM[digit].spriteY,
        (positionX - start) + ((spriteWidth + xOffset) * index),
        this.positionY,
        spriteWidth,
        spriteHeight,
        { centered: true, }
      );
    });
  }
}
