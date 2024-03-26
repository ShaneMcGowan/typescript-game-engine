import { type Scene } from '@core/src/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/src/model/scene-object';

interface Config extends SceneObjectBaseConfig {

}

export class CollisionObject extends SceneObject {
  hasCollision = true;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }
}
