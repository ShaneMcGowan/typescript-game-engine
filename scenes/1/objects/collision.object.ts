import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";

export class CollisionObject implements SceneObject {
  hasCollision = true;
  isRenderable = false;
  positionX;
  positionY;
  targetX;
  targetY;
  tileset = 'tileset_house';
  spriteX = 0;
  spriteY = 0;
  
  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { 
      positionX?: number, 
      positionY?: number,
      isRenderable?: boolean 
    },
  ){
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
    
    this.isRenderable = this.config.isRenderable 
  }
  
  render(): void {
    RenderUtils.renderSprite(
      this.context,
      this.assets.images[this.tileset],
      this.spriteX, 
      this.spriteY,
      this.positionX,
      this.positionY
    );
  }

}