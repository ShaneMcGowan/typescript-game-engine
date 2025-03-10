import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type MenuObject } from './menu.object';
import { ButtonObject } from '../button.object';

interface Config extends SceneObjectBaseConfig {
}

export class MenuButtonContinueObject extends ButtonObject {
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
