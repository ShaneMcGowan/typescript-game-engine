import { SeedsObject } from '@game/objects/seeds/seeds.object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';

interface Config extends SceneObjectBaseConfig {

}

export class WheatSeedsObject extends SeedsObject {
  spriteX = 0;
  spriteY = 0;

  constructor(protected scene: SCENE_GAME, config: Config) {
    super(scene, config);
  }
}
