import { Scene } from "../../../../../model/scene";
import { SceneObject } from "../../../../../model/scene-object";
import { RenderUtils } from "../../../../../utils/render.utils";
import { SAMPLE_SCENE_1 } from "../../../../1.scene";

export class MenuControllerObject extends SceneObject {
  isRenderable = true;
  tileset = 'tileset_button';
  spriteX = 1;
  spriteY = 1;

  controls: Record<string, boolean> = {
    ['start']: false,
  };
 
  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { },
  ){
    super();
  }

  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[this.tileset],
      0, // sprite x
      2, // sprite y
      7.5,
      6.5, // CanvasConstants.CANVIS_CENTER_TILE_Y,
      6,
      2
    );
  }

  update(delta: number): void {
    this.updateStart();
  }

  updateStart(): void {
    if(this.controls['start'] === false){
      return;
    }

    console.log('start pressed');
    this.scene.changeScene(SAMPLE_SCENE_1);

    this.controls['start'] = false;
  }

}