import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";

export class GenericSpriteObject implements SceneObject {
  hasCollision = true;
  positionX;
  positionY;
  targetX;
  targetY;
  
  isRenderable;
  tileset;
  spriteX;
  spriteY;

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { 
      positionX?: number, 
      positionY?: number,
      spriteX?: number,
      spriteY?: number, 
      tileset?: string,
      isRenderable?: boolean 
    },
  ){
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
    
    this.isRenderable = this.config.isRenderable ?? true;
    this.tileset = this.config.tileset ?? 'tileset_house'; // default to house tileset
    this.spriteX = this.config.spriteX ?? 0;
    this.spriteY = this.config.spriteY ?? 0;
  }
  
  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[this.tileset],
      this.spriteX, 
      this.spriteY,
      this.positionX,
      this.positionY
    );
  }

}