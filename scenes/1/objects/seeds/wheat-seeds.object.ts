import { SeedsObject } from './seeds.object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { type SceneObjectBaseConfig } from '@model/scene-object';

interface Config extends SceneObjectBaseConfig {

}

export class WheatSeedsObject extends SeedsObject {
  spriteX = 0;
  spriteY = 0;

  constructor(protected scene: SAMPLE_SCENE_1, protected config: Config) {
    super(scene, config);
  }
}
