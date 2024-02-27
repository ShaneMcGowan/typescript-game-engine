import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type PlayerObject } from './player.object';
import { type ControllerObject } from './controller.object';
import { type GAME_SCENE } from '@flappy-bird/scenes/game/game.scene';

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
  controller: ControllerObject;
  type: PipeType;
  height: number;
}

export class PipeObject extends SceneObject {
  isRenderable = true;

  type: PipeType;

  player: PlayerObject;
  controller: ControllerObject;

  constructor(protected scene: GAME_SCENE, config: Config) {
    super(scene, config);

    this.player = config.player;
    this.controller = config.controller;
    this.type = config.type;
    this.height = config.height;

    this.positionY = this.type === 'top' ? 0 : CanvasConstants.CANVAS_TILE_HEIGHT - this.height;
    this.positionX = CanvasConstants.CANVAS_TILE_WIDTH + 1;
  }

  update(delta: number): void {
    this.updatePosition(delta);
    this.updateCollidingWithPlayer(delta);
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
    this.positionX -= (this.scene.globals.pipe.speed * delta);

    // when off screen, remove pipe
    if (this.positionX < -3) {
      this.scene.removeObject(this);
    }
  }

  private updateCollidingWithPlayer(delta: number): void {
    if (!this.isCollidingWith(this.player)) {
      return;
    }

    this.controller.endGame();
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
}
