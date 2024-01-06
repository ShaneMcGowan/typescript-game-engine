import { Renderable } from "./renderable";

export interface SceneObject extends Renderable {
  isRenderable: boolean;
  positionX: number; // starting x position
  positionY: number; // starting y position
  update?(delta: number): void;
  render?(): void;
  destroy?(): void;
}