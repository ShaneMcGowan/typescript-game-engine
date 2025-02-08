import { ItemList, ItemType } from '@game/models/inventory.model';
import { QuestName } from '@game/models/quest.model';
import { QuestStatus, SavePoint, SCENE_GAME, SceneFlag, StoryFlag } from '@game/scenes/game/scene';

export enum SaveFileKeys {
  Id = 'Id',
  Quests = 'Quests',
  Flags = 'Flags',
  StoryFlags = 'StoryFlags',
  Inventory = 'Inventory',
  SavePoint = 'SavePoint',
};

export abstract class Store {
  static get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static SaveGame(scene: SCENE_GAME, id?: string): void {
    Store.set<string>(SaveFileKeys.Id, id ?? crypto.randomUUID()); // if no previous save, create a new id
    Store.set<Record<QuestName, QuestStatus>>(SaveFileKeys.Quests, scene.globals.quests);
    Store.set<Record<SceneFlag, boolean>>(SaveFileKeys.Flags, scene.globals.flags);
    Store.set<Record<StoryFlag, boolean | number>>(SaveFileKeys.StoryFlags, scene.globals.story_flags);
    Store.set<ItemList>(SaveFileKeys.Inventory, scene.globals.inventory.items);
    Store.set<SavePoint>(SaveFileKeys.SavePoint, scene.globals.save_point);
  }

}
