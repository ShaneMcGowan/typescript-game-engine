import { CanvasConstants } from "../../../../../constants/canvas.constants";
import { Scene } from "../../../../../model/scene";
import { SceneObject, SceneObjectBaseConfig } from "../../../../../model/scene-object";

interface Config extends SceneObjectBaseConfig {
}

export class CameraController extends SceneObject {

  constructor(
    protected scene: Scene,
    protected config: Config,
  ){
    super(scene, config);
    this.mainContext.canvas.addEventListener('click', (event) => {
      let response = this.getMousePosition(this.mainContext.canvas, event);
      console.log(response);
    });
  }

  /**
   * 
   * @param canvas 
   * @param evt 
   * @returns 
   */
  getMousePosition(canvas: HTMLCanvasElement, evt: MouseEvent): { x: number, y: number} {
    let rect = canvas.getBoundingClientRect(); // abs. size of element
    let scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for x
    let scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
  
    return {
      x: Math.floor(((evt.clientX - rect.left) * scaleX) / CanvasConstants.TILE_SIZE),   // scale mouse coordinates after they have
      y: Math.floor(((evt.clientY - rect.top) * scaleY) / CanvasConstants.TILE_SIZE)    // been adjusted to be relative to element
    }
  }
}