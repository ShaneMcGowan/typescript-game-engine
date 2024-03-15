import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from './player.object';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { GameEvents } from '../constants/events.constants';
import { DEFAULT_PIPE_SPEED } from '../constants/defaults.constants';

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class PointObject extends SceneObject {
  isRenderable = true;

  player: PlayerObject;

  width: number = 1;
  height: number = CanvasConstants.CANVAS_TILE_HEIGHT;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.player = config.player;
    this.positionX = CanvasConstants.CANVAS_TILE_WIDTH + 3.25;
    this.positionY = CanvasConstants.CANVAS_CENTER_TILE_Y;

    this.scene.addEventListener(GameEvents.GameEnd, this.onGameOver.bind(this));
  }

  update(delta: number): void {
    this.updatePosition(delta);
    this.updatePoints(delta);
  }

  render(context: CanvasRenderingContext2D): void {

  }

  private updatePosition(delta: number): void {
    // move from left of screen to the right
    this.positionX -= (DEFAULT_PIPE_SPEED * delta);

    // when off screen, remove pipe
    if (this.positionX < -3) { // 3 is arbitrary here, could be a better value
      this.flaggedForDestroy = true;
    }
  }

  private updatePoints(delta: number): void {
    if (!this.isWithinHorizontalBounds(this.player)) {
      return;
    }

    this.scene.globals.score++;
    this.flaggedForDestroy = true;
  }

  private onGameOver(): void {
    this.flaggedForDestroy = true;
  }
}
