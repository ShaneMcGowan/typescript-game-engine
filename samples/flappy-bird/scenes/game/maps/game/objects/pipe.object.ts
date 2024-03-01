import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type PlayerObject } from './player.object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';
import { DEFAULT_PIPE_SPEED } from '../constants/defaults.constants';
import { GameEvents } from '../constants/events.constants';

const SPRITES = {
  TopExit: {
    width: 1.625,
    height: 0.8125,
    tileset: 'sprites',
    spriteX: 5.25,
    spriteY: 20.1875,
  },
  Pipe: {
    width: 1.625,
    height: 0.8125,
    tileset: 'sprites',
    spriteX: 5.25,
    spriteY: 29.375,
  },
  BottomExit: {
    width: 1.625,
    height: 0.8125,
    tileset: 'sprites',
    spriteX: 3.5,
    spriteY: 29.375,
  },
};

type PipeType = 'top' | 'bottom';

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
  type: PipeType;
  height: number;
}

export class PipeObject extends SceneObject {
  isRenderable = true;

  width = 1.625;
  type: PipeType;

  player: PlayerObject;

  canMove: boolean = true;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.player = config.player;
    this.type = config.type;
    this.height = config.height;

    this.positionY = this.type === 'top' ? 0 : CanvasConstants.CANVAS_TILE_HEIGHT - this.height;
    this.positionX = CanvasConstants.CANVAS_TILE_WIDTH + 1;

    this.scene.addEventListener(GameEvents.GameIdle, this.onGameIdle.bind(this));
    this.scene.addEventListener(GameEvents.GameEnd, this.onGameEnd.bind(this));
  }

  update(delta: number): void {
    if (this.canMove) {
      this.updatePosition(delta);
      this.updateCollidingWithPlayer(delta);
    }
  }

  render(context: CanvasRenderingContext2D): void {
    switch (this.type) {
      case 'top':
        this.renderTopPipe(context);
        break;
      case 'bottom':
        this.renderBottomPipe(context);
        break;
    }
  }

  private updatePosition(delta: number): void {
    // move from left of screen to the right
    this.positionX -= (DEFAULT_PIPE_SPEED * delta);

    // when off screen, remove pipe
    if (this.positionX < -3) {
      this.scene.removeObject(this);
    }
  }

  private updateCollidingWithPlayer(delta: number): void {
    // if player collides with pipe
    if (this.isCollidingWith(this.player)) {
      this.scene.dispatchEvent(GameEvents.GameEnd);
    }

    // if player is off top of screen passes over pipe
    if (this.player.positionY < 0 && this.isWithinHorizontalBounds(this.player)) {
      this.scene.dispatchEvent(GameEvents.GameEnd);
    }
  }

  private renderTopPipe(context: CanvasRenderingContext2D): void {
    // repeat pipe until off screen
    for (let i = this.height - SPRITES.BottomExit.height; i >= -3; i -= SPRITES.Pipe.height) {
      RenderUtils.renderSprite(
        context,
        this.assets.images['sprites'],
        SPRITES.Pipe.spriteX,
        SPRITES.Pipe.spriteY,
        this.positionX,
        this.positionY + i,
        SPRITES.Pipe.width,
        SPRITES.Pipe.height
      );
    }

    RenderUtils.renderSprite(
      context,
      this.assets.images['sprites'],
      SPRITES.BottomExit.spriteX,
      SPRITES.BottomExit.spriteY,
      this.positionX,
      this.positionY + this.height - SPRITES.BottomExit.height,
      SPRITES.BottomExit.width,
      SPRITES.BottomExit.height
    );
  }

  private renderBottomPipe(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images['sprites'],
      SPRITES.TopExit.spriteX,
      SPRITES.TopExit.spriteY,
      this.positionX,
      this.positionY,
      SPRITES.TopExit.width,
      SPRITES.TopExit.height
    );

    // repeat pipe until off screen
    for (let i = SPRITES.TopExit.height; i < this.height; i += SPRITES.Pipe.height) {
      RenderUtils.renderSprite(
        context,
        this.assets.images['sprites'],
        SPRITES.Pipe.spriteX,
        SPRITES.Pipe.spriteY,
        this.positionX,
        this.positionY + i,
        SPRITES.Pipe.width,
        SPRITES.Pipe.height
      );
    }
  }

  private onGameIdle(): void {
    this.scene.removeObjectById(this.id);
  }

  private onGameEnd(): void {
    this.canMove = false;
  }
}
