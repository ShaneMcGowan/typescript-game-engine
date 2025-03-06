import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';

interface Config extends SceneObjectBaseConfig {
}

export class MainMenuButtonContactMeObject extends ButtonObject {
  width = 8;
  height = 2;

  constructor(
    protected scene: SCENE_MAIN_MENU,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Contact Me';
  }

  onClick(): void {
    if (this.scene.click) {
      return;
    }

    const link = document.createElement('a');
    link.href = `mailto:contact@shanemcgowan.com`;
    link.target = '_blank';
    link.click();
  }
}
