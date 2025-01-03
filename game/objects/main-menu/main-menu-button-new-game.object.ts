import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SCENE_GAME } from '@game/scenes/game/scene';

interface Config extends SceneObjectBaseConfig {
}

export class MainMenuButtonNewGameObject extends ButtonObject {

  width = 8;
  height = 2;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return `New Game`
  }

  onClick(): void {
    this.scene.changeScene(SCENE_GAME);
  }

}
