import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";
import { PlayerObject } from "./player.object";

export class HoleObject implements SceneObject {
  hasCollision = false;
  isRenderable = false;
  positionX;
  positionY;
  targetX;
  targetY;

  // not used for now
  tileset = 'tileset_house';
  spriteX = 0;
  spriteY = 0;

  // consumption timer
  consumptionTimer = 0;
  consumptionTimerMax = 5; // how often the hole can consume
  
  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { 
      positionX?: number, 
      positionY?: number,
      isRenderable?: boolean 
    },
  ){
    this.positionX = this.config.positionX ?? -1;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? -1;
    this.targetY = this.positionY;
    
    this.isRenderable = this.config.isRenderable 
  }

  update(delta: number): void {
    this.consumptionTimer += delta;

    if(this.consumptionTimer < this.consumptionTimerMax){
      return;
    }

    // the hole consumes
    let objects = this.scene.getAllObjectsAtPosition(this.positionX, this.positionY);
    if(objects.length === 1){
      return;
    }
    
    objects.forEach(o => {
      if(o === this){
        return;
      }

      // if player, change map
      if(o instanceof PlayerObject){
        this.scene.changeMap(1);
        return;
      }
      
      // otherwise remove object from scene
      this.scene.removeObject(o);
    });

    this.consumptionTimer = 0;
  }
  
  render(context: CanvasRenderingContext2D): void {
    RenderUtils.renderCircle(
      context,
      this.positionX,
      this.positionY
    );
  }

}