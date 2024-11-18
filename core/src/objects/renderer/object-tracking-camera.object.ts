import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene, type CustomRendererSignature, type SceneRenderingContext } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

const DEFAULT_ZOOM: number = 1;

interface Config extends SceneObjectBaseConfig {
  object: SceneObject;
  zoom?: number;
}

/**
 * A helper object that attaches a custom renderer to the Scene that follows the provided SceneObject
 * Upon being destroyed, removes the custom renderer from the Scene
 */
export class ObjectTrackingCameraObject extends SceneObject {
  private cameraOffsetX: number;
  private cameraOffsetY: number;
  private readonly object: SceneObject;

  zoom: number;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    // calculation for centering a tile on the screen
    // -0.5 to center the tile (e.g 16 / 2 is 8, which is the center of the tile, but we want to render the player half on either side of this value)
    this.cameraOffsetX = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - 0.5;
    this.cameraOffsetY = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - 0.5;

    this.object = config.object;
    this.zoom = config.zoom ?? DEFAULT_ZOOM;

    this.scene.setCustomRenderer(this.customerRenderer);
  }

  customerRenderer: CustomRendererSignature = (renderingContext: SceneRenderingContext) => {
    // TODO: zoom is broken and not sure why
    this.cameraOffsetX = this.cameraOffsetX / this.zoom;
    this.cameraOffsetY = this.cameraOffsetY / this.zoom;

    // follow scene object
    let startX = this.object.transform.position.local.x - this.cameraOffsetX;
    let startY = this.object.transform.position.local.y - this.cameraOffsetY;
    let endX = this.object.transform.position.local.x + (this.cameraOffsetX + 1);
    let endY = this.object.transform.position.local.y + (this.cameraOffsetY + 1);

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

  onDestroy(): void {
    this.scene.removeCustomerRenderer();
  }
}