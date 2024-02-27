import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from './player.object';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';

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
    this.positionX = CanvasConstants.CANVAS_TILE_WIDTH + 1;
  }

  update(delta: number): void {
    this.updatePosition(delta);
    this.updatePoints(delta);
  }

  render(context: CanvasRenderingContext2D): void {

  }

  private updatePosition(delta: number): void {
    // move from left of screen to the right
    this.positionX -= (this.scene.globals.pipe.speed * delta);

    // when off screen, remove pipe
    if (this.positionX < -3) {
      this.scene.removeObject(this);
    }
  }

  private updatePoints(delta: number): void {
    if (this.positionX < this.player.positionX) {
      this.scene.globals.score++;
      this.scene.removeObject(this);
    }
  }
}
