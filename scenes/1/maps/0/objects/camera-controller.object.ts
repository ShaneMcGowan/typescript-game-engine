import { Scene } from "../../../../../model/scene";
import { SceneObject } from "../../../../../model/scene-object";

export class CameraController extends SceneObject {

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
  ){
    super();
    context.canvas.addEventListener('click', (event) => {
      console.log(event);
      let rect = context.canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      console.log(x, y);
      let tileX = Math.floor(x / 32);
      let tileY = Math.floor(y / 32);
      console.log(tileX, tileY);
      // this.scene.camera.targetX = tileX;
      // this.scene.camera.targetY = tileY;
    })
  }
}