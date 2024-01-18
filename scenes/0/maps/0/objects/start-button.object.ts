import { CanvasConstants } from "../../../../../constants/canvas.constants";
import { Scene } from "../../../../../model/scene";
import { SceneObject, SceneObjectBaseConfig } from "../../../../../model/scene-object";
import { MouseUtils } from "../../../../../utils/mouse.utils";
import { RenderUtils } from "../../../../../utils/render.utils";
import { SAMPLE_SCENE_1 } from "../../../../1.scene";

interface Config extends SceneObjectBaseConfig {

}

export class StartButtonObject extends SceneObject {
  
  isRenderable = true;
  
  controls: Record<string, boolean> = {
    ['start']: false,
    ['button_held']: false,
  };

  // button 
  buttonX = (CanvasConstants.CANVIS_TILE_WIDTH - 6) / 2;
  buttonY = 6;
  buttonWidth = 6;
  buttonHeight = 2;
 
  constructor(
    protected scene: Scene,
    protected config: Config,
  ){
    super(scene, config);

    this.mainContext.canvas.addEventListener('mousedown', (event) => {
      this.onMouseDown(
        MouseUtils.getMousePosition(this.mainContext.canvas, event)
      );
    });

    this.mainContext.canvas.addEventListener('mouseup', (event) => {
      this.onMouseUp(
        MouseUtils.getMousePosition(this.mainContext.canvas, event)
      );
    });
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderStartButton(context);
  }

  private renderStartButton(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images['tileset_button'],
      this.controls['button_held'] ? 6 : 0, // sprite x
      2, // sprite y
      this.buttonX,
      this.buttonY,
      this.buttonWidth,
      this.buttonHeight,
    );
  }

  private onMouseDown(position: {x: number, y: number}): void{
    if(position.x < this.buttonX || position.x > (this.buttonX + this.buttonWidth - 1)){ // -1 because of mouse position compared to tile position
      return;
    }
    if(position.y < this.buttonY || position.y > (this.buttonY + this.buttonHeight - 1)){
      return;
    }

    this.controls['button_held'] = true;
  }

  private onMouseUp(position: {x: number, y: number}): void{
    if(this.controls['button_held'] === false){
      return;
    }

    if(position.x < this.buttonX || position.x > (this.buttonX + this.buttonWidth - 1)){ // -1 because of mouse position compared to tile position
      this.controls['button_held'] = false;
      return;
    }

    if(position.y < this.buttonY || position.y > (this.buttonY + this.buttonHeight - 1)){
      this.controls['button_held'] = false;
      return;
    }

    this.controls['button_held'] = false;
    this.controls['start'] = true;
  }

  update(delta: number): void {
    this.updateStart();
  }

  private updateStart(): void {
    if(this.controls['start'] === false){
      return;
    }

    this.scene.changeScene(SAMPLE_SCENE_1);

    this.controls['start'] = false;
  }

}