import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";

const DAY_LENGTH: number = 60 * 20; // 20 minutes
interface Config extends SceneObjectBaseConfig {}

export class WorldTimeObject extends SceneObject  {
  
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
    this.scene.globals.time %= DAY_LENGTH;
  }

  onRender(context: CanvasRenderingContext2D): void {
    if(!CanvasConstants.DEBUG_MODE){
      return;
    }

    RenderUtils.renderText(
      context,
      `Time: ${this.scene.globals.time}`,
      1,
      1,
      {
        colour: 'white',
        baseline: 'top',
      }
    )
  }
}