import { type QuestStatus, type SCENE_GAME } from '@game/scenes/game/scene';
import { type NpcObject } from '@game/objects/npc.object';
import { type ItemType } from './inventory.model';

export enum QuestName {
  default = 'default',
  collect_wheat = 'collect_wheat',
  break_rocks = 'break_rocks',
  collect_logs = 'collect_logs',
  collect_rocks = 'collect_rocks',
  plant_tree = 'plant_tree',
  collect_berries = 'collect_berries',
  clear_path_to_farm = 'clear_path_to_farm',
  get_some_sleep = 'get_some_sleep'
}

export interface QuestText {
  intro: string;
  success: string;
  failure: string;
}

export abstract class Quest {
  id: QuestName = QuestName.collect_wheat;

  constructor(
    protected scene: SCENE_GAME,
    protected npc: NpcObject
  ) { }

  get status(): QuestStatus {
    return this.scene.globals.quests[this.id];
  }

  get isComplete(): boolean {
    return this.status.complete;
  }

  get text(): QuestText {
    return {
      intro: `TODO: quest ${this.id} intro`,
      success: `TODO: quest ${this.id} success`,
      failure: `TODO: quest ${this.id} failure`,
    };
  }

  run(): void {
    if (this.status.complete) {
      return;
    }

    if (!this.status.intro) {
      this.intro();
      return;
    }

    const check = this.check();
    if (check) {
      this.success();
    } else {
      this.failure();
    }
  }

  intro(): void {
    this.npc.say(
      this.text.intro,
      {
        onComplete: () => {
          this.status.intro = true;
          this.onIntro();
        }
      }
    );
  }

  onIntro(): void { }

  failure(): void {
    this.npc.say(
      this.text.failure,
      {
        onComplete: () => {
          this.onFailure();
        }
      }
    );
  }

  onFailure(): void { }

  success(): void {
    this.npc.say(
      this.text.success,
      {
        onComplete: () => {
          this.status.complete = true;
          this.onSuccess();
        }
      }
    );
  }

  onSuccess(): void { }

  check(): boolean {
    return true;
  }

  protected checkItem(item: ItemType, quantity: number): boolean {
    if (!this.scene.globals.inventory.hasItem(item, quantity)) {
      return false;
    }

    return true;
  }

  protected removeItem(item: ItemType, quantity: number): void {
    this.scene.globals.inventory.removeItems(item, quantity);
  }

  protected checkAndRemoveItem(item: ItemType, quantity: number): boolean {
    if (!this.scene.globals.inventory.hasItem(item, quantity)) {
      return false;
    }

    this.scene.globals.inventory.removeItems(item, quantity);
    return true;
  }

  static setup(scene: SCENE_GAME): void {
    // for setting up the world for the quest
  }
}
