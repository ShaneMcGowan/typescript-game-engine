import { type Scene } from '@core/model/scene';
import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SaveFileKeys, Store } from '@game/utils/store.utils';
import { QuestName } from '@game/models/quest.model';
import { QuestStatus, SCENE_GAME, SceneFlags } from '@game/scenes/game/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';

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
    if(!CanvasConstants.SAVE_FILE_ID){
      Store.set<string>(SaveFileKeys.Id, crypto.randomUUID());
    }

    Store.set<Record<QuestName, QuestStatus>>(SaveFileKeys.Quests, this.scene.globals.quests);
    Store.set<Record<SceneFlags, boolean>>(SaveFileKeys.Flags, this.scene.globals.flags);

    alert('Saved');
  }

}
