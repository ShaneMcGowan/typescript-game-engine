import { CanvasConstants } from '@constants/canvas.constants';
import { type Scene, type CustomRendererSignature, type SceneRenderingContext } from '@model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';
import { RenderUtils } from '@utils/render.utils';

interface Config extends SceneObjectBaseConfig {
  object: SceneObject;
  zoom?: number;
}

// TODO(smg): this object is generic enough to be included at the engine level
export class CameraObject extends SceneObject {
  public readonly cameraOffsetX: number;
  public readonly cameraOffsetY: number;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);

    // calculation for centering a tile on the screen
    // -0.5 to center the tile (e.g 16 / 2 is 8, which is the center of the tile, but we want to render the player half on either side of this value)
    let cameraOffsetX = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - 0.5;
    let cameraOffsetY = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - 0.5;

    // TODO(smg): zoom is broken and not sure why
    this.cameraOffsetX = this.config.zoom ? cameraOffsetX / this.config.zoom : cameraOffsetX;
    this.cameraOffsetY = this.config.zoom ? cameraOffsetY / this.config.zoom : cameraOffsetY;

    this.scene.setCustomRenderer(this.customerRenderer);
  }

  customerRenderer: CustomRendererSignature = (renderingContext: SceneRenderingContext) => {
    // follow scene object
    let startX = this.config.object.positionX - this.cameraOffsetX;
    let startY = this.config.object.positionY - this.cameraOffsetY;
    let endX = this.config.object.positionX + (this.cameraOffsetX + 1);
    let endY = this.config.object.positionY + (this.cameraOffsetY + 1);

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
