import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

type AnimationType = 'block' | 'circle';
type AnimationDirection = 'in' | 'out';

const DEFAULT_ANIMATION_TYPE: AnimationType = 'block';
const DEFAULT_ANIMATION_DIRECTION: AnimationDirection = 'in';
const DEFAULT_ANIMATION_LENGTH = 1; // 1 second
const DEFAULT_ANIMATION_CENTER_X = CanvasConstants.CANVAS_TILE_WIDTH / 2;
const DEFAULT_ANIMATION_CENTER_Y = CanvasConstants.CANVAS_TILE_HEIGHT / 2;

interface Config extends SceneObjectBaseConfig {
  animationType?: AnimationType;
  animationDirection?: AnimationDirection;
  animationLength?: number;
  animationCenterX?: number;
  animationCenterY?: number;
}

/**
 * An object that performs a transition animation
 */
export class TransitionObject extends SceneObject {
  private animationTimer = 0;
  private readonly animationType: AnimationType;
  private readonly animationDirection: AnimationDirection;
  private readonly animationLength: number;
  private readonly animationCenterX: number;
  private readonly animationCenterY: number;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.UI_RENDER_LAYER;

    this.animationType = config.animationType ?? DEFAULT_ANIMATION_TYPE;
    this.animationDirection = config.animationDirection ?? DEFAULT_ANIMATION_DIRECTION;
    this.animationLength = config.animationLength ?? DEFAULT_ANIMATION_LENGTH;
    this.animationCenterX = config.animationCenterX ?? DEFAULT_ANIMATION_CENTER_X;
    this.animationCenterY = config.animationCenterY ?? DEFAULT_ANIMATION_CENTER_Y;
  }

  update(delta: number): void {
    this.animationTimer += delta;
    if (this.animationTimer > this.animationLength) {
      this.scene.removeObjectById(this.id);
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

    let animationCenterX = this.animationCenterX - this.scene.globals.camera.startX;
    let animationCenterY = this.animationCenterY - this.scene.globals.camera.startY;

    // draw arc clockwise then draw rect counter clockwise to have rect with circle cut out of it
    // https://stackoverflow.com/a/11770000
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(
      animationCenterX * CanvasConstants.TILE_SIZE,
      animationCenterY * CanvasConstants.TILE_SIZE,
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
}
