import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from './player.object';
import { RenderUtils } from '@core/utils/render.utils';
import { GameEvents } from '../constants/events.constants';

const DEFAULT_RENDER_LAYER = 10;

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class FloorObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  player: PlayerObject;

  checkCollision: boolean = true;

  constructor(protected scene: Scene, config: Config) {
    super(scene, config);

    // config
    this.player = config.player;

    // setup
    this.height = 2;
    this.width = CanvasConstants.CANVAS_TILE_WIDTH;
    this.positionX = 0;
    this.positionY = CanvasConstants.CANVAS_TILE_HEIGHT - this.height;

    this.scene.addEventListener(GameEvents.GameStart, this.onGameStart.bind(this));
    this.scene.addEventListener(GameEvents.GameEnd, this.onGameOver.bind(this));
  }

  update(delta: number): void {
    if (this.checkCollision) {
      this.updateCheckIfPlayerAboveGround(delta);
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderFloor(context);
  }

  private updateCheckIfPlayerAboveGround(delta: number): void {
    if (this.player.positionY + this.player.height < this.positionY) {
      return;
    }

    this.scene.dispatchEvent(GameEvents.GameEnd);
  }

  private renderFloor(context: CanvasRenderingContext2D): void {
    let segmentWidth: number = 2.25;
    for (let i = 0; i < CanvasConstants.CANVAS_TILE_WIDTH; i += segmentWidth) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        19,
        0,
        this.positionX + i,
        this.positionY,
        segmentWidth,
        this.height
      );
    }
  }

  private onGameStart(): void {
    this.checkCollision = true;
  }

  private onGameOver(): void {
    this.checkCollision = false;
  }
}
