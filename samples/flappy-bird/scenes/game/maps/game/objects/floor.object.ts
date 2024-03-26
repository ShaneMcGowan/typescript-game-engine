import { CanvasConstants } from '@core/src/constants/canvas.constants';
import { type Scene } from '@core/src/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/src/model/scene-object';
import { type PlayerObject } from './player.object';
import { RenderUtils } from '@core/src/utils/render.utils';
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

    this.positionX = CanvasConstants.CANVAS_CENTER_TILE_X;
    this.positionY = CanvasConstants.CANVAS_TILE_HEIGHT - this.height / 2;

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
    if (!this.isWithinVerticalBounds(this.player)) {
      return;
    }

    this.scene.dispatchEvent(GameEvents.GameEnd);
  }

  private renderFloor(context: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.width + (SEGMENT_WIDTH * 2); i += SEGMENT_WIDTH) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.sprites,
        19,
        0,
        this.boundingBox.left + i - this.offset,
        this.positionY,
        SEGMENT_WIDTH,
        this.height,
        { centered: true, }
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
