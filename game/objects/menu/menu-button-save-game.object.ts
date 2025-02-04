import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { ButtonObject } from '../button.object';
import { SaveFileKeys, Store } from '@game/utils/store.utils';
import { QuestName } from '@game/models/quest.model';
import { QuestStatus, SCENE_GAME, SceneFlag, StoryFlag } from '@game/scenes/game/scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { ItemList } from '@game/models/inventory.model';

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
    Store.set<Record<SceneFlag, boolean>>(SaveFileKeys.Flags, this.scene.globals.flags);
    Store.set<Record<StoryFlag, boolean | number>>(SaveFileKeys.StoryFlags, this.scene.globals.story_flags);
    Store.set<ItemList>(SaveFileKeys.Inventory, this.scene.globals.inventory.items);


    alert('Saved');
  }

}
