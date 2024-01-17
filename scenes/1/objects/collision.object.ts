import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";

export class CollisionObject extends SceneObject {
  hasCollision = true;
  
  constructor(
    protected scene: Scene,
    private config: { 
      positionX?: number, 
      positionY?: number,
    },
  ){
    super(scene);
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
  }
  
}