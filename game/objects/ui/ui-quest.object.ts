import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { Quests } from "@game/constants/quests.constants";
import { QuestName } from "@game/models/quest.model";
import { Quest2 } from "@game/models/quest2.model";
import { SCENE_GAME } from "@game/scenes/game/scene";

interface Config extends SceneObjectBaseConfig {}

export class UiQuestObject extends SceneObject {
  
  constructor(protected scene: SCENE_GAME, config: Config){
    super(scene, config);

    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
  }

  onRender(context: CanvasRenderingContext2D): void {
    if(!this.enabled){
      return;
    }

    this.renderQuests(context);
  }

  get enabled(): boolean {
    return this.scene.globals.player.enabled;
  }

  get quests(): Quest2[] {
    return Object.keys(Quests.State).map((key: QuestName) => {
      const quest = Quests.State[key];

      if(quest === undefined){
        return undefined;
      }

      if(quest.isActive){
        return quest;
      }

      return undefined;
    }).filter(quest => quest !== undefined);
  }

  formatUI(quests: Quest2[]): any[] {
    const output: any[] = [];

    quests.forEach((quest, index) => {
      output.push({ type: 'quest', text: quest.title});

      quest.steps.forEach((step, index) => {
        output.push({ type: 'step', text: step.title});

        step.goals.forEach((goal, index) => {
          output.push({ type: 'goal', text: `${goal.description} (${goal.current} / ${goal.target})`});
          
        });
      });
    });

    return output;
  }

  private renderQuests(context: CanvasRenderingContext2D): void {
    const rows = this.formatUI(this.quests);

    rows.forEach((row, index) => {
      let xOffset = 0;
      if(row.type === 'step'){
        xOffset = 1;
      }
      if(row.type === 'goal'){
        xOffset = 2;
      }

      RenderUtils.renderText(
        context,
        row.text,
        this.transform.position.world.x + 1 + xOffset,
        this.transform.position.world.y + 1 + index,
        {
          baseline: 'top'
        }
      );
    });
  }
}