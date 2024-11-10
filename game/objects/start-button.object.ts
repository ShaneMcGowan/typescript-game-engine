import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { Input } from '@core/utils/input.utils';

interface Config extends SceneObjectBaseConfig {

}

export class StartButtonObject extends SceneObject {

  width = 6;
  height = 2;

  // state
  clicked: boolean = false;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
  }

  update(delta: number): void {
    this.updateClickStart();
    this.updateClickEnd();
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderStartButton(context);
  }

  private renderStartButton(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_button,
      this.clicked ? 6 : 0, // sprite x
      2, // sprite y
      this.transform.position.x,
      this.transform.position.y,
      this.width,
      this.height,
      {
        centered: true
      }
    );
  }

  private updateClickStart(): void {
    if (!MouseUtils.wasObjectClicked(this)) {
      return;
    }

    this.clicked = true;
  }

  private updateClickEnd(): void {
    // only run on mouse up
    if (Input.mouse.click.left === true) {
      return;
    }

    if (this.clicked === false) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      this.clicked = false;
      return;
    }

    this.scene.changeScene(SCENE_GAME);
  }
}
