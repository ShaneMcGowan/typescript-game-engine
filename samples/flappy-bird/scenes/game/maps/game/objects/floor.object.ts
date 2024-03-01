import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from './player.object';
import { RenderUtils } from '@core/utils/render.utils';
import { GameEvents } from '../constants/events.constants';
import { DEFAULT_PIPE_SPEED } from '../constants/defaults.constants';

const DEFAULT_RENDER_LAYER = 10;
const SEGMENT_WIDTH = 2.25; // width of the floor segment

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
}

export class FloorObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  offset: number = 0;

  player: PlayerObject;

  checkCollision: boolean = true;
  movingFloor: boolean = false;

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

    if (this.movingFloor) {
      this.offset += delta * DEFAULT_PIPE_SPEED;
      this.offset %= SEGMENT_WIDTH;
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
    for (let i = 0; i < CanvasConstants.CANVAS_TILE_WIDTH + SEGMENT_WIDTH; i += SEGMENT_WIDTH) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        19,
        0,
        this.positionX + i - this.offset,
        this.positionY,
        SEGMENT_WIDTH,
        this.height
      );
    }
  }

  private onGameStart(): void {
    this.checkCollision = true;
    this.movingFloor = true;
  }

  private onGameOver(): void {
    this.checkCollision = false;
    this.movingFloor = false;
  }
}
