import { Renderable } from "./renderable";

export class SceneObject implements Renderable {
  isRenderable: boolean = false; // NOT IMPLEMENTED! to be used to programatically disable the render hook of an object
  hasCollision: boolean = false; // TODO(smg): review

  // position
  positionX: number = -1; 
  positionY: number = -1;
  targetX: number = -1;
  targetY: number = -1;

  // display 
  // TODO(smg): review these
  tileset: string = '';
  spriteX: number = -1;
  spriteY: number = -1;

  update?(delta: number): void;
  render?(context: CanvasRenderingContext2D): void;
  destroy?(): void;
}