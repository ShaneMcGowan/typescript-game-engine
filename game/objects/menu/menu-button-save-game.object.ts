import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SaveFileKeys, Store } from '@game/utils/store.utils';
import { type QuestName } from '@game/models/quest.model';
import { type QuestStatus, type SCENE_GAME, type SceneFlag, type StoryFlag } from '@game/scenes/game/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { type ItemList } from '@game/models/inventory.model';

interface Config extends SceneObjectBaseConfig {
}

export class MenuButtonSaveGameObject extends ButtonObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
  }

  get label(): string {
    return 'Save Game';
  }

  onClick(): void {
    // if no previous save, create an ID
    Store.SaveGame(this.scene, CanvasConstants.SAVE_FILE_ID);
  }
}
