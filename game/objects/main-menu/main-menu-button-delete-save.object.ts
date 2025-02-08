import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { MessageUtils } from '@game/utils/message.utils';
import { ToastMessageObject } from '../toast-message.object';

interface Config extends SceneObjectBaseConfig {
}

export class MainMenuButtonDeleteSaveObject extends ButtonObject {
  width = 8;
  height = 2;

  toast: ToastMessageObject;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Delete Saved Game';
  }

  onClick(): void {
    if (this.toast) {
      if (this.toast.flags.destroy === false) {
        this.toast.destroy();
      }
    }

    this.toast = MessageUtils.showToast(
      this.scene,
      'Your Saved Game has been deleted',
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
