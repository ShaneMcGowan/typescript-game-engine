import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { SpriteAnimation } from '@core/model/sprite-animation';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { RenderUtils } from '@core/utils/render.utils';
import { DEFAULT_PLAYER_GRAVITY, DEFAULT_PLAYER_ACCELERATION } from '../constants/defaults.constants';
import { GameEvents } from '../constants/events.constants';

const DEFAULT_ANIMATIONS: Record<string, SpriteAnimation> = {
  default: new SpriteAnimation('sprites', [
    { spriteX: 0, spriteY: 30.5, duration: 0.0625, },
    { spriteX: 1.75, spriteY: 30.5, duration: 0.0625, },
    { spriteX: 3.5, spriteY: 30.5, duration: 0.0625, },
    { spriteX: 1.75, spriteY: 30.5, duration: 0.0625, }
  ]),
};

type state = 'idle' | 'playing' | 'game-over';

const DEFAULT_RENDER_LAYER: number = 12;

interface Config extends SceneObjectBaseConfig {

}

export class PlayerObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  width = 1.5;
  height = 1;

  state: state;

  // movement
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

    this.positionX = this.startingX;
    this.positionY = this.startingY;

    this.animations = DEFAULT_ANIMATIONS;

    this.state = 'playing';

    this.scene.addEventListener(GameEvents.GameIdle, this.onGameIdle.bind(this));
    this.scene.addEventListener(GameEvents.GameStart, this.onGameStart.bind(this));
    this.scene.addEventListener(GameEvents.GameEnd, this.onGameOver.bind(this));
  }

  update(delta: number): void {
    switch (this.state) {
      case 'idle':
        // this.updatePlaying(delta);
        break;
      case 'playing':
        this.updatePlaying(delta);
        break;
      case 'game-over':
        this.updateGameOver(delta);
        break;
    }
  }

  private updatePlaying(delta: number): void {
    this.updateGravity(delta);
    this.updateFlap(delta);
    this.positionY += (this.speed * delta);
    this.updateAnimationTimer(delta);
  }

  private updateGameOver(delta: number): void {
    // fall towards ground if not at ground
    if (this.positionY > CanvasConstants.CANVAS_TILE_HEIGHT - 3) {
      return;
    }

    this.speed += (DEFAULT_PLAYER_GRAVITY * delta);
    this.positionY += (this.speed * delta);
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderPlayer(context);
  }

  private updateGravity(delta: number): void {
    this.speed += (DEFAULT_PLAYER_GRAVITY * delta);
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
    this.speed += DEFAULT_PLAYER_ACCELERATION;
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

  private onGameIdle(): void {
    this.state = 'idle';
    this.positionX = this.startingX;
    this.positionY = this.startingY;
    this.speed = 0;
  }

  private onGameStart(): void {
    // start with player moving upwards
    this.speed = DEFAULT_PLAYER_ACCELERATION;
    this.state = 'playing';
  }

  private onGameOver(): void {
    this.state = 'game-over';
  }

  get startingX(): number {
    return (CanvasConstants.CANVAS_TILE_WIDTH / 2) - (this.width / 2);
  }

  get startingY(): number {
    return (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (this.height / 2);
  }
}
