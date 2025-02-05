import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { AreaObject } from './area.object';

interface Config extends SceneObjectBaseConfig {
}

export class FurnitureFloorAreaObject extends AreaObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get colour(): string {
    return '#0000FF44';
  }
}
