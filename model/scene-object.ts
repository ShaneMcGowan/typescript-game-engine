import { Renderable } from "./renderable";

// TODO(smg): turn scene object into a class with smart defaults
// positionX = -1 
// positionY = -1
// targetX = -1
// targetY = -1
export interface SceneObject extends Renderable {
  isRenderable?: boolean; // NOT IMPLEMENTED! to be used to programatically disable the render hook of an object
  hasCollision?: boolean;
  positionX: number; // starting x position 
  positionY: number; // starting y position
  targetX: number; // target x position
  targetY: number; // target y position
  update?(delta: number): void;
  render?(context: CanvasRenderingContext2D): void;
  destroy?(): void;
}