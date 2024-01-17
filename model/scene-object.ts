import { Scene } from "./scene";

export class SceneObject {
  isRenderable: boolean = false;
  hasCollision: boolean = false; 

  // position
  positionX: number = -1; 
  positionY: number = -1;
  targetX: number = -1;
  targetY: number = -1;

  protected mainContext: CanvasRenderingContext2D;
  protected assets: Record<string, any>;

  constructor(
    protected scene: Scene
  ){
    this.mainContext = this.scene.context;
    this.assets = this.scene.assets;
  }

  update?(delta: number): void;
  render?(context: CanvasRenderingContext2D): void;
  destroy?(): void;
  
}