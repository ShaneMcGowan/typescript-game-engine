import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type PlayerObject } from './player.object';
import { RenderUtils } from '@utils/render.utils';
import { type ControllerObject } from './controller.object';

const DEFAULT_RENDER_LAYER = 10;

interface Config extends SceneObjectBaseConfig {
  player: PlayerObject;
  controller: ControllerObject;
}

export class FloorObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;

  player: PlayerObject;
  controller: ControllerObject;

  constructor(protected scene: Scene, config: Config) {
    super(scene, config);

    // config
    this.player = config.player;
    this.controller = config.controller;

    // setup
    this.height = 2;
    this.width = CanvasConstants.CANVAS_TILE_WIDTH;
    this.positionX = 0;
    this.positionY = CanvasConstants.CANVAS_TILE_HEIGHT - this.height;
  }

  update(delta: number): void {
    this.updateCheckIfPlayerAboveGround(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderFloor(context);
  }

  private updateCheckIfPlayerAboveGround(delta: number): void {
    if (this.player.positionY + this.player.height < this.positionY) {
      return;
    }

    this.controller.endGame();
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
}
