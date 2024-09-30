import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { type MousePosition, MouseUtils } from '@core/utils/mouse.utils';
import { RenderUtils } from '@core/utils/render.utils';

interface Config extends SceneObjectBaseConfig {

}

export class StartButtonObject extends SceneObject {
  isRenderable = true;

  controls: Record<string, boolean> = {
    ['start']: false,
    ['button_held']: false,
  };

  width = 6;
  height = 2;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    this.mainContext.canvas.addEventListener('mousedown', (event) => {
      this.onMouseDown(
        MouseUtils.getMousePosition(this.mainContext.canvas, event)
      );
    });

    this.mainContext.canvas.addEventListener('mouseup', (event) => {
      this.onMouseUp(
        MouseUtils.getMousePosition(this.mainContext.canvas, event)
      );
    });
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderStartButton(context);
  }

  private renderStartButton(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_button,
      this.controls.button_held ? 6 : 0, // sprite x
      2, // sprite y
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
  }

  private onMouseDown(mousePosition: MousePosition): void {
    if (mousePosition.exactX < this.positionX || mousePosition.exactX > (this.positionX + this.width - 0)) { // -1 because of mouse position compared to tile position
      return;
    }
    if (mousePosition.exactY < this.positionY || mousePosition.exactY > (this.positionY + this.height - 0)) {
      return;
    }

    this.controls.button_held = true;
  }

  private onMouseUp(mousePosition: MousePosition): void {
    if (!this.controls.button_held) {
      return;
    }

    if (mousePosition.exactX < this.positionX || mousePosition.exactX > (this.positionX + this.width - 0)) { // -1 because of mouse position compared to tile position
      this.controls.button_held = false;
      return;
    }

    if (mousePosition.exactY < this.positionY || mousePosition.exactY > (this.positionY + this.height - 0)) {
      this.controls.button_held = false;
      return;
    }

    this.controls.button_held = false;
    this.controls.start = true;
  }

  update(delta: number): void {
    this.updateStart();
  }

  private updateStart(): void {
    if (!this.controls.start) {
      return;
    }

    this.scene.changeScene(SCENE_GAME);

    this.controls.start = false;
  }
}
