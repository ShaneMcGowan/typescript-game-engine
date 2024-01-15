import { CanvasConstants } from "../../../../../constants/canvas.constants";
import { CustomRendererSignature, Scene, SceneRenderingContext } from "../../../../../model/scene";
import { SceneObject } from "../../../../../model/scene-object";
import { RenderUtils } from "../../../../../utils/render.utils";
import { PlayerObject } from "../../../objects/player.object";

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

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { player: PlayerObject },
  ){
    this.scene.setCustomRenderer(this.customerRenderer);
  }

  customerRenderer: CustomRendererSignature = (renderingContext: SceneRenderingContext) => {
    let area = 8; // X tiles in each direction from player around the player
    let startX = this.config.player.positionX - area;
    let startY = this.config.player.positionY - (area * CanvasConstants.ASPECT_RATIO);
    let endX = this.config.player.positionX + area;
    let endY = this.config.player.positionY + (area * CanvasConstants.ASPECT_RATIO);

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