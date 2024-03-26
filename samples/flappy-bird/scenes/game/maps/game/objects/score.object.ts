import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { RenderUtils } from '@core/utils/render.utils';
import { NUMBER_SPRITES_LARGE } from '../constants/sprite.constants';

interface Config extends SceneObjectBaseConfig {}

export class ScoreObject extends SceneObject {
  isRenderable = true;
  renderLayer = CanvasConstants.UI_COLLISION_LAYER;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.positionX = CanvasConstants.CANVAS_CENTER_TILE_X;
    this.positionY = 2;
    this.width = CanvasConstants.CANVAS_TILE_WIDTH;
    this.height = 1.125;
  }

  render(context: CanvasRenderingContext2D): void {
    let score = this.scene.globals.score.toString().split('');

    score.forEach((digit, index) => {
      let offset = digit === '1' ? 0.16 : 0; // the 1 sprite in the sheet is a bit off so manually adjusting it rather than altering the sprite sheet

      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        NUMBER_SPRITES_LARGE[digit].spriteX,
        NUMBER_SPRITES_LARGE[digit].spriteY,
        this.positionX - ((score.length - 1) / 2) + index + offset, // center text v
        this.positionY,
        undefined,
        this.height,
        { centered: true, }
      );
    });
  }
}
