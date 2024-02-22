import { CanvasConstants } from '@constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { RenderUtils } from '@utils/render.utils';

type AnimationType = 'block' | 'circle';
type AnimationDirection = 'in' | 'out';

const DEFAULT_ANIMATION_TYPE: AnimationType = 'block';
const DEFAULT_ANIMATION_DIRECTION: AnimationDirection = 'in';
const DEFAULT_ANIMATION_LENGTH = 1; // 1 second

interface Config extends SceneObjectBaseConfig {
  animationType?: AnimationType;
  animationDirection?: AnimationDirection;
  animationLength?: number;
}

export class TransitionObject extends SceneObject {
  isRenderable: boolean = true;

  private animationTimer = 0;
  private readonly animationType: AnimationType;
  private readonly animationDirection: AnimationDirection;
  private readonly animationLength: number;
  readonly renderLayer = CanvasConstants.UI_RENDER_LAYER;

  constructor(
    protected scene: SAMPLE_SCENE_1,
    protected config: Config
  ) {
    super(scene, config);

    this.animationType = config.animationType ? config.animationType : DEFAULT_ANIMATION_TYPE;
    this.animationDirection = config.animationDirection ? config.animationDirection : DEFAULT_ANIMATION_DIRECTION;
    this.animationLength = config.animationLength ? config.animationLength : DEFAULT_ANIMATION_LENGTH;
  }

  update(delta: number): void {
    this.animationTimer += delta;
    if (this.animationTimer > this.animationLength) {
      // this.scene.removeObject(this);
    }
  }

  get animationPercentage(): number {
    return this.animationTimer / this.animationLength;
  }

  render(context: CanvasRenderingContext2D): void {
    switch (this.animationType) {
      case 'block':
        this.renderAnimationBlock(context);
        break;
      case 'circle':
        this.renderAnimationCircle(context);
        break;
    }
  }

  private renderAnimationBlock(context: CanvasRenderingContext2D): void {
    let alpha = this.animationDirection === 'in' ? 1 - this.animationPercentage : this.animationPercentage;
    RenderUtils.fillRectangle(
      context,
      0,
      0,
      CanvasConstants.CANVAS_WIDTH,
      CanvasConstants.CANVAS_HEIGHT,
      { colour: `rgba(0, 0, 0, ${alpha})`, }
    );
  }

  private renderAnimationCircle(context: CanvasRenderingContext2D): void {
    let radiusModifier = this.animationDirection === 'in' ? this.animationPercentage : 1 - this.animationPercentage;

    // draw arc clockwise then draw rect counter clockwise to have rect with circle cut out of it
    // https://stackoverflow.com/a/11770000
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(
      CanvasConstants.CANVAS_WIDTH / 2,
      CanvasConstants.CANVAS_HEIGHT / 2,
      CanvasConstants.CANVAS_WIDTH * radiusModifier,
      0,
      2 * Math.PI
    );
    context.rect(
      CanvasConstants.CANVAS_WIDTH,
      0,
      CanvasConstants.CANVAS_WIDTH * -1,
      CanvasConstants.CANVAS_HEIGHT
    );
    context.fill();
  }

  destroy(): void {
    console.log('[TransitionObject] animation complete');
  }
}
