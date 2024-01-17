import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";

export class CollisionObject extends SceneObject {
  hasCollision = true;
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
    },
  ){
    super();
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
  }
  
}