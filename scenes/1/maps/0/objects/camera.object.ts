import { CanvasConstants } from "../../../../../constants/canvas.constants";
import { CustomRendererSignature, Scene, SceneRenderingContext } from "../../../../../model/scene";
import { SceneObject } from "../../../../../model/scene-object";
import { RenderUtils } from "../../../../../utils/render.utils";

// TODO(smg): this object is generic enough to be included at the engine level
export class CameraObject implements SceneObject {
  isRenderable = false;
  hasCollision = false;
  positionX = -1;
  positionY = 1;
  targetX = -1;
  targetY = -1;

  tileset = '';
  spriteX = 0;
  spriteY = 0;

  private cameraOffsetX: number;
  private cameraOffsetY: number;

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { object: SceneObject, zoom?: number },
  ){
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


    renderingContext.background.forEach((context) => {
      RenderUtils.renderSubsection(context, this.context, startX, startY, endX, endY);
    });
    renderingContext.objects.forEach((context) => {
      RenderUtils.renderSubsection(context, this.context, startX, startY, endX, endY);
    });
  };
  
  destroy(): void {
    this.scene.removeCustomerRenderer();
  }
}