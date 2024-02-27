import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { MouseUtils } from '@core/utils/mouse.utils';
import { GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { RenderUtils } from '@utils/render.utils';

interface Config extends SceneObjectBaseConfig {

}

export class StartButtonObject extends SceneObject {
  isRenderable = true;

  constructor(protected scene: Scene, config: Config) {
    super(scene, config);

    this.width = 3.5;
    this.height = 2;
    this.positionX = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - (this.width / 2);
    this.positionY = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (this.height / 2);
  }

  update(delta: number): void {
    if (!this.scene.globals.mouse.click.left) {
      return;
    }

    this.scene.globals.mouse.click.left = false;

    let clicked = MouseUtils.isClickWithin(this.scene.globals.mouse.position, this.positionX, this.positionY, this.width, this.height);
    if (!clicked) {
      return;
    }

    this.scene.changeScene(GAME_SCENE);
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images['sprites'],
      22,
      7.25,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
  }
}
