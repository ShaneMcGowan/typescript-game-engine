import { CustomRendererSignature, Scene, SceneRenderingContext } from "../../../../../model/scene";
import { SceneObject } from "../../../../../model/scene-object";

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
    private assets: Record<string, any>
  ){
    this.scene.setCustomRenderer(this.customerRenderer);
  }

  customerRenderer: CustomRendererSignature = (renderingContext: SceneRenderingContext) => {
    renderingContext.background.forEach((layer) => {});
    renderingContext.objects.forEach((object) => {});
  };
  
  destroy(): void {
    this.scene.removeCustomerRenderer();
  }
}