import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Scene, type CustomRendererSignature, type SceneRenderingContext } from '@core/model/scene';
import { type SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';

const DEFAULT_ZOOM: number = 1;

export interface ObjectTrackingCameraRendererConfig {
  object: SceneObject;
  zoom?: number;
}

/**
 * A helper object that attaches a custom renderer to the Scene that follows the provided SceneObject
 * Upon being destroyed, removes the custom renderer from the Scene
 */
export const ObjectTrackingCameraRenderer = (scene: Scene, config: ObjectTrackingCameraRendererConfig): CustomRendererSignature => {
  let cameraOffsetX: number = 0;
  let cameraOffsetY: number = 0;
  const object = config.object;
  const zoom = config.zoom ?? DEFAULT_ZOOM;

  // calculation for centering a tile on the screen
  // -0.5 to center the tile (e.g 16 / 2 is 8, which is the center of the tile, but we want to render the player half on either side of this value)
  cameraOffsetX = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - 0.5;
  cameraOffsetY = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - 0.5;

  const customerRenderer: CustomRendererSignature = (renderingContext: SceneRenderingContext) => {
    // TODO: zoom is broken and not sure why
    const adjustedCameraOffsetX = cameraOffsetX / zoom;
    const adjustedCameraOffsetY = cameraOffsetY / zoom;

    // follow scene object
    let startX = object.transform.position.world.x - adjustedCameraOffsetX;
    let startY = object.transform.position.world.y - adjustedCameraOffsetY;
    let endX = object.transform.position.world.x + (adjustedCameraOffsetX + 1);
    let endY = object.transform.position.world.y + (adjustedCameraOffsetY + 1);

    // if the camera is at the edge of the map, don't render outside of the map
    if (startX < 0) {
      startX = 0;
      endX = startX + CanvasConstants.CANVAS_TILE_WIDTH;
    } else if (endX > scene.map.width) {
      endX = scene.map.width;
      startX = endX - CanvasConstants.CANVAS_TILE_WIDTH;
    }

    if (startY < 0) {
      startY = 0;
      endY = startY + CanvasConstants.CANVAS_TILE_HEIGHT;
    } else if (endY > scene.map.height) {
      endY = scene.map.height;
      startY = endY - CanvasConstants.CANVAS_TILE_HEIGHT;
    }

    // set camera positions
    scene.globals.camera.startX = startX;
    scene.globals.camera.startY = startY;
    scene.globals.camera.endX = endX;
    scene.globals.camera.endY = endY;

    // background
    // only render the background we are looking at
    scene.background(
      {
        xStart: Math.floor(startX),
        yStart: Math.floor(startY),
        xEnd: Math.min(scene.map.background.width - 1, Math.floor(endX) + 1),
        yEnd: Math.min(scene.map.background.height - 1, Math.floor(endY) + 1),
      }
    );

    renderingContext.background.forEach((context) => {
      RenderUtils.renderSubsection(context, scene.renderContext, startX, startY, endX, endY);
    });

    renderingContext.objects.forEach((context, index) => {
      if (index >= CanvasConstants.FIRST_UI_RENDER_LAYER) {
        RenderUtils.renderSubsection(context, scene.renderContext, 0, 0, CanvasConstants.CANVAS_TILE_WIDTH, CanvasConstants.CANVAS_TILE_HEIGHT);
      } else {
        RenderUtils.renderSubsection(context, scene.renderContext, startX, startY, endX, endY);
      }
    });
  };

  return customerRenderer;
};
