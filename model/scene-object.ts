export class SceneObject {
  isRenderable: boolean = false;
  hasCollision: boolean = false; 

  // position
  positionX: number = -1; 
  positionY: number = -1;
  targetX: number = -1;
  targetY: number = -1;

  update?(delta: number): void;
  render?(context: CanvasRenderingContext2D): void;
  destroy?(): void;
}