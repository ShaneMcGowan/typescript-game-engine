import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { RenderUtils } from '@core/utils/render.utils';

const SPRITES: Record<string, any> = {
  ['0']: { spriteX: 30.875, spriteY: 3.75, },
  ['1']: { spriteX: 8.35, spriteY: 28.45, },
  ['2']: { spriteX: 18.125, spriteY: 10, },
  ['3']: { spriteX: 19, spriteY: 10, },
  ['4']: { spriteX: 19.875, spriteY: 10, },
  ['5']: { spriteX: 20.75, spriteY: 10, },
  ['6']: { spriteX: 18.125, spriteY: 11.5, },
  ['7']: { spriteX: 19, spriteY: 11.5, },
  ['8']: { spriteX: 19.875, spriteY: 11.5, },
  ['9']: { spriteX: 20.75, spriteY: 11.5, },
};

interface Config extends SceneObjectBaseConfig {}

export class ScoreObject extends SceneObject {
  isRenderable = true;
  renderLayer = CanvasConstants.UI_COLLISION_LAYER;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);
  }

  render(context: CanvasRenderingContext2D): void {
    let score = this.scene.globals.score.toString().split('');

    score.forEach((digit, index) => {
      let offset = digit === '1' ? 0.16 : 0; // the 1 sprite in the sheet is a bit off so manually adjusting it rather than altering the sprite sheet

      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        SPRITES[digit].spriteX,
        SPRITES[digit].spriteY,
        (CanvasConstants.CANVAS_TILE_WIDTH / 2) - (score.length / 2) + index + offset,
        CanvasConstants.CANVAS_TILE_HEIGHT / 8,
        undefined,
        1.125
      );
    });
  }
}
