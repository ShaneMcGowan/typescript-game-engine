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

  static StartQuest(scene: SCENE_GAME, name: QuestName): void {
    scene.globals.quests[name].active = true;

    // TODO: start first step
  }
  
}