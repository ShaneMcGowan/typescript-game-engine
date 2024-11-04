import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';

interface Config extends SceneObjectBaseConfig {

}

export class CollisionObject extends SceneObject {
  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);

    this.collision.enabled = true;
  }
}
