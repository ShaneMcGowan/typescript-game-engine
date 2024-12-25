import { CanvasConstants } from '@core/constants/canvas.constants';
import { type Renderer } from '@core/model/renderer';
import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type ClientScreen } from '@core/model/screen';
import { RenderUtils } from '@core/utils/render.utils';

const DEFAULT_ZOOM: number = 1;

export interface ObjectTrackingCameraObjectConfig extends SceneObjectBaseConfig {
  object: SceneObject;
  zoom?: number;
}

/**
 * A helper object that attaches a custom renderer to the Scene that follows the provided SceneObject
 * Upon being destroyed, removes the custom renderer from the Scene
 */
export class ObjectTrackingCameraObject extends SceneObject {
  private readonly cameraOffsetX: number;
  private readonly cameraOffsetY: number;
  private readonly object: SceneObject;

  zoom: number;

  constructor(
    protected scene: Scene,
    private readonly screen: ClientScreen,
    config: ObjectTrackingCameraObjectConfig
  ) {
    super(scene, config);

    this.transform.position.local.x = -1;
    this.transform.position.local.y = -1;

    // calculation for centering a tile on the screen
    // -0.5 to center the tile (e.g 16 / 2 is 8, which is the center of the tile, but we want to render the player half on either side of this value)
    this.cameraOffsetX = (CanvasConstants.CANVAS_TILE_WIDTH / 2) - 0.5;
    this.cameraOffsetY = (CanvasConstants.CANVAS_TILE_HEIGHT / 2) - 0.5;

    this.object = config.object;
    this.zoom = config.zoom ?? DEFAULT_ZOOM;

    this.screen.addRenderer(this.customerRenderer);
  }

  customerRenderer: Renderer = (scene: Scene, screen: ClientScreen) => {
    // TODO: zoom is broken and not sure why
    const adjustedCameraOffsetX = this.cameraOffsetX / this.zoom;
    const adjustedCameraOffsetY = this.cameraOffsetY / this.zoom;

    // follow scene object
    let startX = this.object.transform.position.world.x - adjustedCameraOffsetX;
    let startY = this.object.transform.position.world.y - adjustedCameraOffsetY;
    let endX = this.object.transform.position.world.x + (adjustedCameraOffsetX + 1);
    let endY = this.object.transform.position.world.y + (adjustedCameraOffsetY + 1);

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
    this.screen.camera.startX = startX;
    this.screen.camera.startY = startY;
    this.screen.camera.endX = endX;
    this.screen.camera.endY = endY;

    // background
    // only render the background we are looking at
    // build layers
    scene.renderBackgrounds(screen);
    scene.renderObjects(screen);

    // compile frame
    screen.contexts.background.forEach((context) => {
      RenderUtils.renderSubsection(
        context,
        screen.contexts.rendering,
        screen.camera.startX,
        screen.camera.startY,
        screen.camera.endX,
        screen.camera.endY
      );
    });
    screen.contexts.objects.forEach((context, index) => {
      // if UI layer, render without relative to camera
      if (index >= CanvasConstants.FIRST_UI_RENDER_LAYER) {
        RenderUtils.renderSubsection(
          context,
          screen.contexts.rendering,
          0,
          0,
          CanvasConstants.CANVAS_TILE_WIDTH, // TODO: check this is correct
          CanvasConstants.CANVAS_TILE_HEIGHT // TODO: check this is correct
        );
      } else {
        RenderUtils.renderSubsection(
          context,
          screen.contexts.rendering,
          screen.camera.startX,
          screen.camera.startY,
          screen.camera.endX,
          screen.camera.endY
        );
      }
    });

    // copy frame
    screen.contexts.display.drawImage(screen.contexts.rendering.canvas, 0, 0);
  };

  onDestroy(): void {
    this.screen.removeRenderer();
  }
}
