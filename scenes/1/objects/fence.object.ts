import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";

export class FenceType {
  static TopLeft = {x: 1, y: 0};
  static TopRight = {x: 3, y: 0};
  static BottomLeft = {x: 1, y: 2 };
  static BottomRight = {x: 3, y: 2};
  static MiddleHorizontal = { x: 2, y: 3};
  static MiddleVertical = { x: 0, y: 1};
  static FencePost = { x: 0, y: 3 }
}

export class FenceObject implements SceneObject {
  isRenderable = true;
  hasCollision = true;
  positionX;
  positionY;
  targetX;
  targetY;
  spriteX = 1;
  spriteY = 0;
  tileset = 'tileset_fence';

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: Partial<{ positionX: number, positionY: number, type: { x: number, y: number } }>,
  ){
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
    if(this.config.type){
      this.spriteX = this.config.type.x;
      this.spriteY = this.config.type.y;
    }
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