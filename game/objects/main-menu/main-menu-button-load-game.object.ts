import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SaveFileKeys, Store } from '@game/utils/store.utils';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { SCENE_GAME } from '@game/scenes/game/scene';

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
    return 'Load Game';
  }

  onClick(): void {
    const id = Store.get<string>(SaveFileKeys.Id);
    if (id === null) {
      alert('No save file');
      CanvasConstants.SAVE_FILE_ID = null;
      return;
    }

    CanvasConstants.SAVE_FILE_ID = id;
    alert(`Loading save file: ${id}`);
    this.scene.changeScene(SCENE_GAME);
  }
}
