import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { MessageUtils } from '@game/utils/message.utils';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';

interface Config extends SceneObjectBaseConfig {
}

export class MainMenuButtonDeleteSaveObject extends ButtonObject {
  width = 8;
  height = 2;

  constructor(
    protected scene: SCENE_MAIN_MENU,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Delete Saved Game';
  }

  onClick(): void {
    MessageUtils.showToast(
      this.scene,
      'Your saved game has been deleted.',
      {
        speedIn: 16,
        speedOut: 16,
        timerDelay: 0,
      }
    );

    localStorage.clear();
    return;
  }
}
