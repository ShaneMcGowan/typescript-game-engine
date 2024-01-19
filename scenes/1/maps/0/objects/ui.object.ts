import { type Scene } from '@model/scene';
import { type SceneObjectBaseConfig, SceneObject } from '@model/scene-object';

interface Config extends SceneObjectBaseConfig {

}

export class UiObject extends SceneObject {
  constructor(
    protected scene: Scene,
    protected config: Config
  ) {
    super(scene, config);
  }
}
