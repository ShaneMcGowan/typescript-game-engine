import { CanvasConstants } from '@constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { RenderUtils } from '@utils/render.utils';

const DEFAULT_ANIMATION_DIRECTION = 'in';
const DEFAULT_ANIMATION_LENGTH = 1; // 1 second

interface Config extends SceneObjectBaseConfig {
  animationDirection?: 'in' | 'out';
  animationLength?: number;
}

export class TransitionObject extends SceneObject {
  isRenderable: boolean = true;

  private animationTimer = 0;
  private readonly animationDirection: 'in' | 'out';
  private readonly animationLength: number;
  readonly renderLayer = CanvasConstants.UI_RENDER_LAYER;

  constructor(
    protected scene: SAMPLE_SCENE_1,
    protected config: Config
  ) {
    super(scene, config);

    this.animationDirection = config.animationDirection ? config.animationDirection : DEFAULT_ANIMATION_DIRECTION;
    this.animationLength = config.animationLength ? config.animationLength : DEFAULT_ANIMATION_LENGTH;
  }

  update(delta: number): void {
    this.animationTimer += delta;
    if (this.animationTimer > this.animationLength) {
      this.scene.removeObject(this);
    }
  }

  get animationPercentage(): number {
    return this.animationTimer / this.animationLength;
  }

  get animationAlpha(): number {
    if (this.animationDirection === 'in') {
      return 1 - this.animationPercentage;
    } else {
      return this.animationPercentage;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      0,
      0,
      CanvasConstants.CANVAS_WIDTH,
      CanvasConstants.CANVAS_HEIGHT,
      { colour: `rgba(0, 0, 0, ${this.animationAlpha})`, }
    );
  }

  destroy(): void {
    console.log('[TransitionObject] animation complete');
  }
}
