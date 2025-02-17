import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

const SPEED_IN: number = 8;
const SPEED_OUT: number = 8;
const TIMER_DELAY_MAX: number = 1;
const TIMER_PAUSE_MAX: number = 5;

interface Config extends SceneObjectBaseConfig {
  text: string;
  speedIn?: number;
  speedOut?: number;
  timerDelay?: number;
  timerPause?: number;
}

export class ToastMessageObject extends SceneObject {
  width: number = CanvasConstants.CANVAS_TILE_WIDTH / 3;
  height: number = 2;

  moveInComplete: boolean = false;
  moveOutComplete: boolean = false;
  timerDelay: number = 0;
  timerPause: number = 0;

  constructor(protected scene: Scene, protected config: Config) {
    super(scene, config);

    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;

    this.transform.position.local.x = CanvasConstants.CANVAS_CENTER_TILE_X - (this.width / 2);
    this.transform.position.local.y = 0 - this.height;
  }

  onUpdate(delta: number): void {
    this.timerDelay += delta;
    if (this.timerDelay < this.timerDelayLength) {
      return;
    }

    this.updateMoveIn(delta);

    if (!this.moveInComplete) {
      return;
    }

    this.timerPause += delta;
    if (this.timerPause < this.timerPauseLength) {
      return;
    }

    this.updateMoveOut(delta);

    if (!this.moveOutComplete) {
      return;
    }

    this.destroy();
  }

  get speedIn(): number {
    return this.config.speedIn ?? SPEED_IN;
  }

  get speedOut(): number {
    return this.config.speedOut ?? SPEED_OUT;
  }

  get timerDelayLength(): number {
    return this.config.timerDelay ?? TIMER_DELAY_MAX;
  }

  get timerPauseLength(): number {
    return this.config.timerPause ?? TIMER_PAUSE_MAX;
  }

  updateMoveIn(delta: number): void {
    if (this.moveInComplete) {
      return;
    }

    const targetPosition = 1;

    if (this.transform.position.local.y > targetPosition) {
      this.moveInComplete = true;
      return;
    }

    this.transform.position.local.y += delta * this.speedIn;
  }

  updateMoveOut(delta: number): void {
    if (!this.moveInComplete) {
      return;
    }

    if (this.moveOutComplete) {
      return;
    }

    const targetPosition = 0 - this.height;

    if (this.transform.position.local.y < targetPosition) {
      this.moveOutComplete = true;
      return;
    }

    this.transform.position.local.y -= delta * this.speedOut;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderTextbox(context);
    this.renderMessage(context);
  }

  get text(): string {
    return this.config.text;
  }

  private renderMessage(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      this.text,
      this.centre.world.x,
      this.centre.world.y,
      {
        align: 'center',
        baseline: 'middle',
      }
    );
  }

  private renderTextbox(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        colour: '#DCDCDD',
        type: 'tile',
      }
    );
  }
}
