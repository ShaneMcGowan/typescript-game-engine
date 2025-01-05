import { QuestStatus, SCENE_GAME } from "@game/scenes/game/scene";
import { NpcObject } from "@game/objects/npc.object";
import { ItemType } from "./inventory.model";

export enum QuestName {
  default = 'default',
  collect_wheat = 'collect_wheat',
  break_rocks = 'break_rocks',
  collect_logs = 'collect_logs',
  collect_rocks = 'collect_rocks',
  plant_tree = 'plant_tree',
  collect_berries = 'collect_berries',
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
  ){}

  get quest(): QuestStatus {
    return this.scene.globals.quests[this.id];
  }

  get isComplete(): boolean {
    return this.quest.complete;
  }

  get text(): QuestText {
    return {
      intro: `TODO: quest ${this.id} intro`,
      success: `TODO: quest ${this.id} success`,
      failure: `TODO: quest ${this.id} failure`,
    }
  }

  run(): void {
    if(this.quest.complete){
      return;
    }

    if(!this.quest.intro){
      this.intro();
      return;
    } 
    
    const check = this.check();
    if(check){
      this.success();
    } else {
      this.failure();
    }
  }

  intro(): void {
    this.npc.say(
      this.text.intro,
      () => { 
        this.quest.intro = true; 
        this.onIntro();
      },
    );
  }

  onIntro(): void {}

  failure(): void {
    this.npc.say(
      this.text.failure,
      () => {
        this.onFailure();
      }
    );
  }

  onFailure(): void {}

  success(): void {
    this.npc.say(
      this.text.success,
      () => { 
        this.quest.complete = true;
        this.onSuccess();
      }
    );
  }

  onSuccess(): void {}

  check(): boolean {
    return true;
  }
  
  protected checkItem(item: ItemType, quantity: number): boolean {
    if(!this.scene.globals.inventory.hasItem(item, quantity)){
      return false;
    }

    this.scene.globals.inventory.removeItems(item, quantity);
    return true;
  }

  static setup(scene: SCENE_GAME): void {
    // for setting up the world for the quest
  }
  
}