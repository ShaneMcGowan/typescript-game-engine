import { Renderable } from "./renderable";

export interface SceneObject extends Renderable {
  isRenderable?: boolean; // NOT IMPLEMENTED! to be used to programatically disable the render hook of an object
  hasCollision?: boolean;
  positionX: number; // starting x position
  positionY: number; // starting y position
  update?(delta: number): void;
  render?(): void;
  destroy?(): void;
}