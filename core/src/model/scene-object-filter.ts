import { ObjectFilter } from "./scene";
import { SceneObjectBoundingBox, SceneObject } from "./scene-object";

export class SceneObjectFilter {

  private state: ObjectFilter = {}

  boundingBox(value: SceneObjectBoundingBox): this {
    this.state.boundingBox = value;

    return this;
  }

  boundingBoxHorizontal(value: SceneObjectBoundingBox): this {
    this.state.boundingBoxHorizontal = value;

    return this;
  }

  boundingBoxVertical(value: SceneObjectBoundingBox): this {
    this.state.boundingBoxVertical = value;

    return this;
  }

  position(value: { x: number, y: number }): this {
    this.state.position = value;

    return this;
  }

  objectIgnore(value: Map<SceneObject, boolean>): this {
    this.state.objectIgnore = value;

    return this;
  }

  objectMatch(value: Map<SceneObject, boolean>): this {
    this.state.objectMatch = value;

    return this;
  }

  typeMatch(value: any[]): this {
    this.state.typeMatch = value;

    return this;
  }

  typeIgnore(value: any[]): this {
    this.state.typeIgnore = value;

    return this;
  }

  collision(value: {
    enabled?: boolean;
    layerMatch?: Map<number, boolean>;
    layerIgnore?: Map<number, boolean>;
  }): this {
    this.state.collision = value;

    return this;
  }

  custom(value: (object: SceneObject) => boolean): this {
    this.state.custom = value;

    return this;
  }

  build(): ObjectFilter {
    return {
      ...this.state,
    };
  }
}