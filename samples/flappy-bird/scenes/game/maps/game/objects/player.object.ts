import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { SpriteAnimation } from '@core/model/sprite-animation';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { RenderUtils } from '@utils/render.utils';

const DEFAULT_ANIMATIONS: Record<string, SpriteAnimation> = {
  default: new SpriteAnimation('sprites', [
    { spriteX: 0, spriteY: 30.5, duration: 0.0625, },
    { spriteX: 1.75, spriteY: 30.5, duration: 0.0625, },
    { spriteX: 3.5, spriteY: 30.5, duration: 0.0625, },
    { spriteX: 1.75, spriteY: 30.5, duration: 0.0625, }
  ]),
};

interface Config extends SceneObjectBaseConfig {

}

export class PlayerObject extends SceneObject {
  isRenderable = true;
  width = 1.5;
  height = 1;

  // movement
  canMove: boolean = true;
  speed: number = 0;

  // animations
  animationEnabled: boolean = true;
  animations: Record<string, SpriteAnimation>;
  animation = {
    index: 0,
    timer: 0,
  };

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.positionX = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - (this.width / 2);
    this.positionY = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (this.height / 2);

    this.animations = DEFAULT_ANIMATIONS;
  }

  update(delta: number): void {
    if (this.canMove) {
      this.updateGravity(delta);
      this.updateFlap(delta);
    }

    this.positionY += (this.speed * delta);

    this.updateAnimationTimer(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderPlayer(context);
  }

  private updateGravity(delta: number): void {
    this.speed += (this.scene.globals.player.gravity * delta);
  }

  private updateFlap(delta: number): void {
    if (!this.scene.globals.mouse.click.left && !this.scene.globals.keyboard[' ']) {
      return;
    }

    this.scene.globals.mouse.click.left = false;
    this.scene.globals.keyboard[' '] = false;

    // if falling, reset speed to 0
    if (this.speed > 0) {
      this.speed = 0;
    }
    this.speed += this.scene.globals.player.acceleration;
  }

  private updateAnimationTimer(delta: number): void {
    if (!this.animationEnabled) {
      return;
    }

    this.animation.timer = (this.animation.timer + delta) % this.animations['default'].duration;
  }

  private renderPlayer(context: CanvasRenderingContext2D): void {
    let animation = this.animations['default'];
    let frame = animation.currentFrame(this.animation.timer);

    RenderUtils.renderSprite(
      context,
      this.assets.images[animation.tileset],
      frame.spriteX,
      frame.spriteY,
      this.positionX,
      this.positionY,
      this.width,
      undefined,
      {
        opacity: this.renderOpacity,
        scale: this.renderScale,
      }
    );
  }
}
