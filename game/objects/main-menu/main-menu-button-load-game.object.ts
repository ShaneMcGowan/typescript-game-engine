import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SaveFileKeys, Store } from '@game/utils/store.utils';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { TransitionObject } from '@core/objects/transition.object';
import { MessageUtils } from '@game/utils/message.utils';
import { ToastMessageObject } from '../toast-message.object';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';

interface Config extends SceneObjectBaseConfig {
}

export class MainMenuButtonLoadGameObject extends ButtonObject {
  width = 8;
  height = 2;

  constructor(
    protected scene: SCENE_MAIN_MENU,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Load Game';
  }

  onClick(): void {
    if (this.scene.click) {
      return;
    }

    const id = Store.get<string>(SaveFileKeys.Id);

    if (id === null) {
      MessageUtils.showToast(
        this.scene,
        'You have no saved game.',
        {
          speedIn: 16,
          speedOut: 16,
          timerDelay: 0,
        }
      );
      CanvasConstants.SAVE_FILE_ID = null;
      return;
    }

    this.scene.click = true;

    CanvasConstants.SAVE_FILE_ID = id;
    this.scene.addObject(new TransitionObject(
      this.scene,
      {
        animationType: 'block',
        animationDirection: 'out',
        onDestroy: () => {
          this.scene.changeScene(SCENE_GAME);
        }
      }
    ));
  }
}
