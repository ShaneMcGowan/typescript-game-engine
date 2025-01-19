import { SCENE_GAME } from "@game/scenes/game/scene";
import { QuestName } from "./quest.model";

export interface QuestStatus {
  active: boolean;
  complete: boolean;
}

export enum QuestGoalKey {
  default = 'default',
  collect_berries__open_gate = 'collect_berries__open_gate',
  collect_berries__find_berries = 'collect_berries__find_berries',
  collect_berries__find_watering_can = 'collect_berries__find_watering_can',
  collect_berries__return_to_farmer = 'collect_berries__return_to_farmer',
}

export abstract class QuestStep {
  title: string = '';

  intro: string = '';
  success: string = '';
  failure: string = '';

  goals: QuestGoal[] = [];

  constructor(protected scene: SCENE_GAME){}

  get isComplete(): boolean {
    return this.goals.every(goal => goal.isComplete);
  }

  onIntro(): void {}
  onFailure(): void {}
  onSuccess(): void {}

}

export enum QuestGoalType {
  Action,
  PickUp,
  TalkTo
}

export abstract class QuestGoal {
  
  key: QuestGoalKey = QuestGoalKey.default;
  description: string = '';
  type: QuestGoalType = QuestGoalType.PickUp;
  typeTarget: string | undefined = undefined;
  target: number = 0;

  constructor(protected scene: SCENE_GAME){}

  get current (): number {
    return this.scene.globals.quests_goals[this.key];
  }

  get isComplete(): boolean {
    return this.current >= this.target;
  }

  setup(): void { }

}
 
export abstract class Quest2 {

  id: QuestName = QuestName.default;

  title: string = '';

  steps: Array<QuestStep> = [];

  constructor(
    protected scene: SCENE_GAME,
  ) { }

  get isActive(): boolean {
    return this.scene.globals.quests[this.id].active;
  }

  get isComplete(): boolean {
    return this.scene.globals.quests[this.id].complete;
  }

  get textIntro(): string {
    return 'TODO';
  };

  get textComplete(): string {
    return 'TODO:';
  }

  onIntro(): void {}
  onComplete(): void {}

  /*
  run(): void {
    if (this.status.complete) {
      return;
    }

    if (!this.status.active) {
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
      () => {
        this.status.active = true;
        this.onIntro();
      },
    );
  }

  onIntro(): void { }

  failure(): void {
    this.npc.say(
      this.text.failure,
      () => {
        this.onFailure();
      }
    );
  }

  onFailure(): void { }

  success(): void {
    this.npc.say(
      this.text.success,
      () => {
        this.status.complete = true;
        this.onSuccess();
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

    this.scene.globals.inventory.removeItems(item, quantity);
    return true;
  }

  static setup(scene: SCENE_GAME): void {
    // for setting up the world for the quest
  }
    */

}