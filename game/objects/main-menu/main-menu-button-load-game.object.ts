import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';

interface Config extends SceneObjectBaseConfig {
}

export class MainMenuButtonLoadGameObject extends ButtonObject {

  width = 8;
  height = 2;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return `Load Game`
  }

  onClick(): void {
    alert('Coming Soon');
  }

}
