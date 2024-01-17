import { CanvasConstants } from "../../../../../constants/canvas.constants";
import { CustomRendererSignature, Scene, SceneRenderingContext } from "../../../../../model/scene";
import { SceneObject, SceneObjectBaseConfig } from "../../../../../model/scene-object";
import { RenderUtils } from "../../../../../utils/render.utils";

interface Config extends SceneObjectBaseConfig {
  object: SceneObject;
  zoom?: number
}

// TODO(smg): this object is generic enough to be included at the engine level
export class CameraObject extends SceneObject {

  private cameraOffsetX: number;
  private cameraOffsetY: number;

  constructor(
    protected scene: Scene,
    protected config: Config
  ){
    super(scene, config);
    // calculation for centering a tile on the screen
    // TODO(smg): figure out why these values lead to a blurry render if the canvas doesn't have an even number CANVIS_TILE_WIDTH and odd number CANVIS_TILE_HEIGHT
    let cameraOffsetX = CanvasConstants.CANVIS_TILE_WIDTH % 2 === 0 ? (CanvasConstants.CANVIS_TILE_WIDTH / 2) - 0.5 : (CanvasConstants.CANVIS_TILE_WIDTH / 2);
    let cameraOffsetY = (CanvasConstants.CANVIS_TILE_HEIGHT % 2 === 0) ? (CanvasConstants.CANVIS_TILE_HEIGHT / 2) : (CanvasConstants.CANVIS_TILE_HEIGHT / 2) - 0.5;
    
    // TODO(smg): this is currently resulting in a blurry render so avoid use for now
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
    if(startX < 0){
      startX = 0;
      endX = startX + CanvasConstants.CANVIS_TILE_WIDTH;
    } else if(endX > this.scene.map.width){
      endX = this.scene.map.width;
      startX = endX - CanvasConstants.CANVIS_TILE_WIDTH;
    }

    if(startY < 0){
      startY = 0;
      endY = startY + CanvasConstants.CANVIS_TILE_HEIGHT;
    } else if(endY > this.scene.map.height){
      endY = this.scene.map.height;
      startY = endY - CanvasConstants.CANVIS_TILE_HEIGHT;
    }
    
    renderingContext.background.forEach((context) => {
      RenderUtils.renderSubsection(context, this.mainContext, startX, startY, endX, endY);
    });
    renderingContext.objects.forEach((context) => {
      RenderUtils.renderSubsection(context, this.mainContext, startX, startY, endX, endY);
    });
  };
  
  destroy(): void {
    this.scene.removeCustomerRenderer();
  }
}