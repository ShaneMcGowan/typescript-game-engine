import { Scene } from "../../../../../model/scene";
import { SceneObject } from "../../../../../model/scene-object";

export class MenuControllerObject implements SceneObject {
  
  isRenderable = false;
  hasCollision = false;
  positionX = -1;
  positionY = -1;
  targetX = -1;
  targetY = -1;
  tileset = 'tileset_player';
  spriteX = 1;
  spriteY = 1;

  controls: Record<string, boolean> = {
    ['start']: false,
  }
 
  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { },
  ){
    document.addEventListener('keyup', (event) => {
      switch(event.key.toLocaleLowerCase()){
        case ' ':
          this.controls['start'] = true;
          break;
      }
    });
  }

  update(delta: number): void {
    this.updateStart();
  }

  updateStart(): void {
    if(this.controls['start'] === false){
      return;
    }

    console.log('start pressed');

    // TODO(smg): load different scene

    this.controls['start'] = false;
  }

  destroy(): void {
  }

}