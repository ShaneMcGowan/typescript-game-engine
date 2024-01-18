import { type Scene } from '../../../model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '../../../model/scene-object';

interface Config extends SceneObjectBaseConfig {

}

export class CollisionObject extends SceneObject {
  hasCollision = true;

  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);
  }
}
