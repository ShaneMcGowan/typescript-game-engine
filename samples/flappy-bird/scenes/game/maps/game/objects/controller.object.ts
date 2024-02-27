import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from './player.object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';

const DEFAULT_PLAYER_GRAVITY: number = 48;
const DEFAULT_PLAYER_ACCELERATION: number = -12;
const DEFAULT_PIPE_SPEED: number = 3;

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class ControllerObject extends SceneObject {
  state: 'playing' | 'paused' | 'game-over' = 'playing';

  player: PlayerObject;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.player = config.player;

    this.resetGame();
  }

  update(delta: number): void {
    console.log('ControllerObject update');
  }

  endGame(): void {
    if (this.state !== 'playing') {
      return;
    }

    this.scene.globals.player.gravity = 0;
    this.scene.globals.player.acceleration = 0;
    this.scene.globals.pipe.speed = 0;

    this.player.speed = 0;
    this.player.animationEnabled = false;
    // TODO(smg): stop player moving
    // TODO(smg): stop player animation
  }

  resetGame(): void {
    this.scene.globals.player.gravity = DEFAULT_PLAYER_GRAVITY;
    this.scene.globals.player.acceleration = DEFAULT_PLAYER_ACCELERATION;
    this.scene.globals.pipe.speed = DEFAULT_PIPE_SPEED;

    this.player.animationEnabled = true;
    this.scene.globals.score = 0;
  }
}
