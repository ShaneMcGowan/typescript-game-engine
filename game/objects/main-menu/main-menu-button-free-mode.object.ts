import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SCENE_GAME } from '@game/scenes/game/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { TransitionObject } from '@core/objects/transition.object';
import { SCENE_MAIN_MENU } from '@game/scenes/main-menu/scene';
import { SCENE_GAME_MAP_FLAT } from '@game/scenes/game/maps/flat/map';

interface Config extends SceneObjectBaseConfig {
}

export class MainMenuButtonFreeModeObject extends ButtonObject {
  width = 8;
  height = 2;

  constructor(
    protected scene: SCENE_MAIN_MENU,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Free Mode';
  }

  onClick(): void {
    if (this.scene.click) {
      return;
    }
    this.scene.click = true;

    CanvasConstants.SAVE_FILE_ID = null;

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
