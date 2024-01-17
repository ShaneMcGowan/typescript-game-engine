import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";


export class GenericSpriteObject extends SceneObject {
  hasCollision = true;  
  isRenderable = true;

  tileset: string;
  spriteX: number;
  spriteY: number;

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { 
      positionX?: number, 
      positionY?: number,
      spriteX: number,
      spriteY: number, 
      tileset: string,
      isRenderable?: boolean 
    },
  ){
    super();
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
    
    this.isRenderable = this.config.isRenderable ?? true;
    
    this.tileset = this.config.tileset;
    this.spriteX = this.config.spriteX;
    this.spriteY = this.config.spriteY;
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