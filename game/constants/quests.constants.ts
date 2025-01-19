import { Inventory, ItemType } from "@game/models/inventory.model";
import { QuestName } from "@game/models/quest.model";
import { Quest2, QuestGoal, QuestGoalKey, QuestGoalType, QuestStep } from "@game/models/quest2.model";
import { SCENE_GAME } from "@game/scenes/game/scene";

export abstract class Quests {

  static State: Record<QuestName, Quest2> = {
    [QuestName.default]: undefined,
    [QuestName.collect_wheat]: undefined,
    [QuestName.break_rocks]: undefined,
    [QuestName.collect_logs]: undefined,
    [QuestName.collect_rocks]: undefined,
    [QuestName.plant_tree]: undefined,
    [QuestName.collect_berries]: undefined,
    [QuestName.clear_path_to_farm]: undefined
  }

  static RecordAction(scene: SCENE_GAME, type: QuestGoalType, target: string): void {
    Object.values(this.State).forEach(quest => {
      // ensure defined
      if(quest === undefined){
        return;
      }

      if(!quest.isActive){
        return;
      }

      quest.steps.forEach(step => {
        // TODO: only active 

        step.goals.forEach(goal => {
          if(goal.isComplete){
            return;
          }

          if(goal.type === type && goal.typeTarget === target){
            scene.globals.quests_goals[goal.key]++;
          }
        });
      });

    });
  }
  
}

class StepOpenGate extends QuestStep {

  title = 'Open the gate.';
  goals = [
    new GoalOpenGate(this.scene)
  ];

  constructor(scene: SCENE_GAME){
    super(scene);
  }
}

class StepFindItems extends QuestStep {

  title = 'Find supplies.';
  goals = [
    new GoalFindBerries(this.scene),
    new GoalFindWateringCan(this.scene),
  ];

  constructor(scene: SCENE_GAME){
    super(scene);
  }
}

class StepReturnToFarmer extends QuestStep {

  title = 'Return to the farmer.';
  goals = [
    new GoalReturnToFarmer(this.scene)
  ];

  constructor(scene: SCENE_GAME){
    super(scene);
  }
}

class GoalOpenGate extends QuestGoal {

  key = QuestGoalKey.collect_berries__open_gate;
  description = 'Open the gate';
  
  type = QuestGoalType.Action;
  typeTarget = `OpenGate`;
  
  target = 1;

  constructor(scene: SCENE_GAME){
    super(scene);
  }
  
  setup(): void {
    // TODO: place gate in world
  }
}

const FIND_BERRIES_TARGET: number = 4;

class GoalFindBerries extends QuestGoal {

  key = QuestGoalKey.collect_berries__find_berries;
  description = `Find ${FIND_BERRIES_TARGET} ${Inventory.getItemName(ItemType.Berry, true)}`;
  
  type = QuestGoalType.PickUp;
  typeTarget = `${ItemType.Berry}`;
  
  target = FIND_BERRIES_TARGET;

  constructor(scene: SCENE_GAME){
    super(scene);
  }
  
  setup(): void {
    // TODO: place berries in world
  }
}

class GoalFindWateringCan extends QuestGoal {

  key = QuestGoalKey.collect_berries__find_berries;
  description = `Find the ${Inventory.getItemName(ItemType.WateringCan)}`;
  
  type = QuestGoalType.PickUp;
  typeTarget = `${ItemType.WateringCan}`;
  
  target = 1;

  constructor(scene: SCENE_GAME){
    super(scene);
  }
  
  setup(): void {
    // TODO: place watering can in world
  }
}

class GoalReturnToFarmer extends QuestGoal {

  key = QuestGoalKey.collect_berries__return_to_farmer;
  description = `Return to the farmer.`;
  
  type = QuestGoalType.TalkTo;
  typeTarget = `Farmer`;
  
  target = 1;

  constructor(scene: SCENE_GAME){
    super(scene);
  }
  
  setup(): void {}
  
}

export class QuestCollectBerries2 extends Quest2 {

  id: QuestName = QuestName.collect_berries;

  title = 'Collect Berries';

  steps: Array<QuestStep> = [
    new StepOpenGate(this.scene),
    new StepFindItems(this.scene),
    new StepReturnToFarmer(this.scene),
  ];

  constructor(scene: SCENE_GAME){
    super(scene);
  }
}