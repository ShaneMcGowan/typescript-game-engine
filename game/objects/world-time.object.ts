import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { SCENE_GAME_MAP_HOUSE } from "@game/scenes/game/maps/house/map";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MessageUtils } from "@game/utils/message.utils";

const DAY_LENGTH: number = 60 * 20; // 20 minutes
interface Config extends SceneObjectBaseConfig {}

export class WorldTimeObject extends SceneObject  {
  
  changing: boolean = false;

  constructor(
    protected scene: SCENE_GAME, 
    config: Config
  ){
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
  }

  onUpdate(delta: number): void {
    this.scene.globals.time += delta;

    if(this.scene.globals.time <= DAY_LENGTH){
      this.changing = false;
      return;
    }

    if(this.changing){
      return;
    }

    this.changing = true;

    // day over, pass out
    MessageUtils.showMessage(
      this.scene,
      `I'm feeling very sleepy...`,
      () => {
        this.scene.changeMap(SCENE_GAME_MAP_HOUSE);
        this.scene.newDay();
      }
    );

  }

  onRender(context: CanvasRenderingContext2D): void {
    if(!CanvasConstants.DEBUG_MODE){
      return;
    }

    RenderUtils.renderText(
      context,
      `Day: ${this.scene.globals.day}`,
      1,
      1,
      {
        colour: 'white',
        baseline: 'top',
      }
    );
    
    RenderUtils.renderText(
      context,
      `Time: ${this.scene.globals.time}`,
      1,
      2,
      {
        colour: 'white',
        baseline: 'top',
      }
    );

    RenderUtils.renderText(
      context,
      `Day of the Week: ${this.scene.day}`,
      1,
      3,
      {
        colour: 'white',
        baseline: 'top',
      }
    );

    RenderUtils.renderText(
      context,
      `Season: ${this.scene.season}`,
      1,
      4,
      {
        colour: 'white',
        baseline: 'top',
      }
    );

    RenderUtils.renderText(
      context,
      `Year: ${this.scene.year}`,
      1,
      5,
      {
        colour: 'white',
        baseline: 'top',
      }
    );

  }
}