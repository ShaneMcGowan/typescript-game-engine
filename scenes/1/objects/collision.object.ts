import { Scene } from "../../../model/scene";
import { SceneObject, SceneObjectBaseConfig } from "../../../model/scene-object";

interface Config extends SceneObjectBaseConfig {

}

export class CollisionObject extends SceneObject {
  hasCollision = true;
  
  constructor(
    protected scene: Scene,
    protected config: Config
  ){
    super(scene, config);
  }
  
}