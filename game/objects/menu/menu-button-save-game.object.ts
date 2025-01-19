import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SaveFileKeys, Store } from '@game/utils/store.utils';
import { QuestName } from '@game/models/quest.model';
import { SCENE_GAME, SceneFlag } from '@game/scenes/game/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { Item, ItemList } from '@game/models/inventory.model';
import { QuestGoalKey, QuestStatus } from '@game/models/quest2.model';

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
    if (!CanvasConstants.SAVE_FILE_ID) {
      Store.set<string>(SaveFileKeys.Id, crypto.randomUUID());
    }

    Store.set<Record<QuestName, QuestStatus>>(SaveFileKeys.Quests, this.scene.globals.quests);
    Store.set<Record<QuestGoalKey, number>>(SaveFileKeys.QuestGoalKey, this.scene.globals.quests_goals);
    Store.set<Record<SceneFlag, boolean>>(SaveFileKeys.Flags, this.scene.globals.flags);
    Store.set<ItemList>(SaveFileKeys.Inventory, this.scene.globals.inventory.items);

    alert('Saved');
  }

}
