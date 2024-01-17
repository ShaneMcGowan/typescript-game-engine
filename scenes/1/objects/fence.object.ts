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

const TILE_SET = 'tileset_fence';

export class FenceObject extends SceneObject {
  isRenderable = true;
  hasCollision = true;

  private type: { x: number, y: number } = FenceType.FencePost;

  constructor(
    protected scene: Scene,
    private config: Partial<{ positionX: number, positionY: number, type: { x: number, y: number } }>,
  ){
    super(scene);
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
    
    if(this.config.type){
      this.type = this.config.type
    }
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      this.type.x, 
      this.type.y,
      this.positionX,
      this.positionY
    );
  }

}