import { type SCENE_GAME } from '@game/scenes/game/scene';
import { FurnitureObject, type FurnitureConfig } from './furniture.object';

interface Config extends FurnitureConfig {

}

export class FurnitureItemObject extends FurnitureObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }
}
