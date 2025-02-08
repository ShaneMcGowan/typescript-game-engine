import { SceneObject } from "@core/model/scene-object";

export interface Serializable {
  serialize: () => Record<string, string | number>;
  deserialize: () => Record<string, string | number>;
}

export function isSerializable(object: SceneObject): object is (SceneObject & Serializable) {
  return 'serialize' in object && 'deserialize' in object;
}