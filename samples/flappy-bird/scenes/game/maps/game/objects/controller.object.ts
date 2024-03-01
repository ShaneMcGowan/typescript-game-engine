import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { GameEvents } from '../constants/events.constants';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { IntervalObject } from '@core/objects/interval.object';
import { MathUtils } from '@core/utils/math.utils';
import { PipeObject } from './pipe.object';
import { PointObject } from './point.object';
import { type PlayerObject } from './player.object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { SpriteObject } from '@core/objects/sprite.object';
import { ScoreCardObject } from './score-card.object';
import { DEFAULT_PIPE_GAP, DEFAULT_PIPE_REGION } from '../constants/defaults.constants';

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

type state = 'idle' | 'playing' | 'game-over';

export class ControllerObject extends SceneObject {
  state: state;

  player: PlayerObject;

  // object references
  interval: IntervalObject;
  idleSprite: SpriteObject;
  scorecard: ScoreCardObject;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.player = config.player;

    this.scene.addEventListener(GameEvents.GameIdle, this.onGameIdle.bind(this));
    this.scene.addEventListener(GameEvents.GameStart, this.onGameStart.bind(this));
    this.scene.addEventListener(GameEvents.GameEnd, this.onGameEnd.bind(this));

    this.scene.dispatchEvent(GameEvents.GameIdle);
  }

  update(delta: number): void {
    switch (this.state) {
      case 'idle':
        this.updateGameIdle();
        break;
      case 'game-over':
        this.updateGameEnd();
        break;
    }
  }

  private onGameIdle(): void {
    if (this.state === 'idle') {
      return;
    }

    this.cleanupGameEnd();

    this.state = 'idle';

    this.scene.globals.score = 0;

    // values here are awkwardly hardcoded
    let spriteWidth = 3.675;
    let spriteHeight = 3.5;
    this.idleSprite = new SpriteObject(this.scene, {
      positionX: (CanvasConstants.CANVAS_TILE_WIDTH / 2) - (spriteWidth / 2) + 0.05,
      positionY: (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - 0.8,
      width: spriteWidth,
      height: spriteHeight,
      tileset: 'sprites',
      spriteX: 18.25,
      spriteY: 5.25,
      renderLayer: CanvasConstants.UI_COLLISION_LAYER,
    });
    this.scene.addObject(this.idleSprite);
  }

  private onGameStart(): void {
    if (this.state === 'playing') {
      return;
    }
    this.state = 'playing';

    if (this.idleSprite) {
      this.scene.removeObjectById(this.idleSprite.id);
    }

    this.interval = new IntervalObject(this.scene, {
      duration: 2,
      onInterval: () => {
        let region = DEFAULT_PIPE_REGION;
        let gap = DEFAULT_PIPE_GAP;
        let min = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - (region / 2);
        let max = min + (region / 2);

        let height = MathUtils.randomNumberFromRange(min, max);

        // Pipes
        this.scene.addObject(new PipeObject(this.scene, {
          player: this.player,
          type: 'top',
          height,
        }));

        this.scene.addObject(new PipeObject(this.scene, {
          player: this.player,
          type: 'bottom',
          height: CanvasConstants.CANVAS_TILE_HEIGHT - height - gap,
        }));

        // point
        this.scene.addObject(new PointObject(this.scene, {
          player: this.player,
        }));
      },
    });
    this.scene.addObject(this.interval);
  }

  private onGameEnd(): void {
    if (this.state === 'game-over') {
      return;
    }
    this.state = 'game-over';

    // TODO(smg): move cleanup of previous state to it's own function
    if (this.interval) {
      this.scene.removeObjectById(this.interval.id);
    }

    // scorecard
    this.scorecard = new ScoreCardObject(this.scene, {});
    this.scene.addObject(this.scorecard);

    // set highscore
    if (this.scene.globals.score > this.scene.globals.highscore) {
      this.scene.globals.highscore = this.scene.globals.score;
      localStorage.setItem('highscore', this.scene.globals.score.toString());
    }
  }

  private cleanupGameEnd(): void {
    if (this.scorecard) {
      this.scene.removeObjectById(this.scorecard.id);
    }
  }

  updateGameEnd(): void {
    if (!this.scene.globals.keyboard[' '] && !this.scene.globals.mouse.click.left) {
      return;
    }

    this.scene.globals.keyboard[' '] = false;
    this.scene.globals.mouse.click.left = false;

    this.scene.dispatchEvent(GameEvents.GameIdle);
  }

  updateGameIdle(): void {
    if (!this.scene.globals.keyboard[' '] && !this.scene.globals.mouse.click.left) {
      return;
    }

    this.scene.globals.keyboard[' '] = false;
    this.scene.globals.mouse.click.left = false;

    this.scene.dispatchEvent(GameEvents.GameStart);
  }
}
