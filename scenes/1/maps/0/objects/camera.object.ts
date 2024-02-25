import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene, type CustomRendererSignature, type SceneRenderingContext } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@utils/render.utils';

interface Config extends SceneObjectBaseConfig {
  object: SceneObject;
  zoom?: number;
}

// TODO(smg): this object is generic enough to be included at the engine level
export class CameraObject extends SceneObject {
  private readonly cameraOffsetX: number;
  private readonly cameraOffsetY: number;
  private readonly object: SceneObject;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    // calculation for centering a tile on the screen
    // -0.5 to center the tile (e.g 16 / 2 is 8, which is the center of the tile, but we want to render the player half on either side of this value)
    let cameraOffsetX = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - 0.5;
    let cameraOffsetY = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - 0.5;

    // TODO(smg): zoom is broken and not sure why
    this.cameraOffsetX = config.zoom ? cameraOffsetX / config.zoom : cameraOffsetX;
    this.cameraOffsetY = config.zoom ? cameraOffsetY / config.zoom : cameraOffsetY;
    this.object = config.object;

    this.scene.setCustomRenderer(this.customerRenderer);
  }

  customerRenderer: CustomRendererSignature = (renderingContext: SceneRenderingContext) => {
    // follow scene object
    let startX = this.object.positionX - this.cameraOffsetX;
    let startY = this.object.positionY - this.cameraOffsetY;
    let endX = this.object.positionX + (this.cameraOffsetX + 1);
    let endY = this.object.positionY + (this.cameraOffsetY + 1);

    // if the camera is at the edge of the map, don't render outside of the map
    if (startX < 0) {
      startX = 0;
      endX = startX + CanvasConstants.CANVAS_TILE_WIDTH;
    } else if (endX > this.scene.map.width) {
      endX = this.scene.map.width;
      startX = endX - CanvasConstants.CANVAS_TILE_WIDTH;
    }

    if (startY < 0) {
      startY = 0;
      endY = startY + CanvasConstants.CANVAS_TILE_HEIGHT;
    } else if (endY > this.scene.map.height) {
      endY = this.scene.map.height;
      startY = endY - CanvasConstants.CANVAS_TILE_HEIGHT;
    }

    // set camera positions
    this.scene.globals.camera.startX = startX;
    this.scene.globals.camera.startY = startY;
    this.scene.globals.camera.endX = endX;
    this.scene.globals.camera.endY = endY;

    // render
    renderingContext.background.forEach((context) => {
      RenderUtils.renderSubsection(context, this.mainContext, startX, startY, endX, endY);
    });
    renderingContext.objects.forEach((context, index) => {
      if (index === CanvasConstants.UI_RENDER_LAYER) {
        RenderUtils.renderSubsection(context, this.mainContext, 0, 0, CanvasConstants.CANVAS_TILE_WIDTH, CanvasConstants.CANVAS_TILE_HEIGHT);
      } else {
        RenderUtils.renderSubsection(context, this.mainContext, startX, startY, endX, endY);
      }
    });
  };

  destroy(): void {
    this.scene.removeCustomerRenderer();
  }
}
