import { CanvasConstants } from "@core/constants/canvas.constants";
import { Scene } from "@core/model/scene";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";

const IN_SPEED: number = 8;
const OUT_SPEED: number = 8;
const TIMER_DELAY_MAX: number = 1; 
const TIMER_PAUSE_MAX: number = 5; 

interface Config extends SceneObjectBaseConfig {
  text: string;
}

export class ToastMessageObject extends SceneObject {
  
  width: number = CanvasConstants.CANVAS_TILE_WIDTH / 3;
  height: number = 3;

  moveInComplete: boolean = false;
  moveOutComplete: boolean = false;
  timerDelay: number = 0;
  timerPause: number = 0;

  constructor(protected scene: Scene, protected config: Config){
    super(scene, config);

    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;

    this.transform.position.local.x = CanvasConstants.CANVAS_CENTER_TILE_X - (this.width / 2);
    this.transform.position.local.y = 0 - this.height;
  }

  onUpdate(delta: number): void {

    this.timerDelay += delta;
    if(this.timerDelay < TIMER_DELAY_MAX){
      return;
    }
    
    this.updateMoveIn(delta);

    if(!this.moveInComplete){
      return;
    }

    this.timerPause += delta;
    if(this.timerPause < TIMER_PAUSE_MAX){
      return;
    }

    this.updateMoveOut(delta);

    if(!this.moveOutComplete){
      return;
    }

    this.destroy();
  }

  updateMoveIn(delta: number): void {
    if(this.moveInComplete){
      return;
    }

    const targetPosition = 1;

    if(this.transform.position.local.y > targetPosition){
      this.moveInComplete = true;
      return;
    }

    this.transform.position.local.y += delta * IN_SPEED;
  }

  updateMoveOut(delta: number): void {
    if(!this.moveInComplete){
      return;
    }

    if(this.moveOutComplete){
      return;
    }

    const targetPosition = 0 - this.height;

    if(this.transform.position.local.y < targetPosition){
      this.moveOutComplete = true;
      return;
    }

    this.transform.position.local.y -= delta * OUT_SPEED;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderTextbox(context);
    this.renderMessage(context);
  }

  get text(): string {
    return this.config.text;
  }

  private renderMessage(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      this.text,
      this.centre.world.x,
      this.centre.world.y,
      {
        align: 'center',
        baseline: 'middle',
      }
    )
  }

  private renderTextbox(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.world.x,
      this.transform.position.world.y,
      this.width,
      this.height,
      {
        colour: 'brown',
        type: 'tile',
      }
    );
  }
  
}