import { SeedsObject } from './seeds.object';
import { type SAMPLE_SCENE_1 } from '@game/scenes/1/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';

interface Config extends SceneObjectBaseConfig {

}

export class TomatoSeedsObject extends SeedsObject {
  spriteX = 0;
  spriteY = 1;

  constructor(protected scene: SAMPLE_SCENE_1, config: Config) {
    super(scene, config);
  }
}
