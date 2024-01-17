import { Scene } from "../../../model/scene";
import { SceneObject, SceneObjectBaseConfig } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";

interface Config extends SceneObjectBaseConfig {
  tileset: string,
  spriteX: number,
  spriteY: number, 
  isRenderable?: boolean 
}

export class GenericSpriteObject extends SceneObject {
  hasCollision = true;  
  isRenderable = true;

  tileset: string;
  spriteX: number;
  spriteY: number;

  constructor(
    protected scene: Scene,
    protected config: Config,
  ){
    super(scene, config);

    if(this.config.isRenderable === undefined) {
      this.isRenderable = this.config.isRenderable;    
    }
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