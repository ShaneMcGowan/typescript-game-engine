import { CanvasConstants } from '@core/src/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/src/model/scene-object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { RenderUtils } from '@core/src/utils/render.utils';

interface Config extends SceneObjectBaseConfig {}

export class ScoreCardObject extends SceneObject {
  isRenderable = true;
  renderLayer = CanvasConstants.UI_COLLISION_LAYER;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.positionX = CanvasConstants.CANVAS_CENTER_TILE_X;
    this.positionY = CanvasConstants.CANVAS_CENTER_TILE_Y;
    this.width = 7.5;
    this.height = 4;
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderBackground(context);
  }

  private renderBackground(context: CanvasRenderingContext2D): void {
    let spriteWidth = 7.5;
    let spriteHeight = 4;

    RenderUtils.renderSprite(
      context,
      this.assets.images.sprites,
      0,
      16,
      this.positionX,
      this.positionY,
      spriteWidth,
      spriteHeight,
      { centered: true, }
    );
  }

  destroy(): void {}
}
