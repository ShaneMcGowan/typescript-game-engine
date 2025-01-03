import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { MenuObject } from './menu.object';
import { MenuButtonObject } from './menu-button.object';

interface Config extends SceneObjectBaseConfig {
}

export class MenuButtonContinueObject extends MenuButtonObject {

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Continue';
  }

  onClick(): void {
    (this.parent as MenuObject).destroy();
  }

}
