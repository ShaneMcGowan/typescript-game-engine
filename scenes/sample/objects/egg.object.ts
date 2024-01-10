import { Scene } from "../../../model/scene";
import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";
import { ChickenObject } from "./chicken.object";
import { PlayerObject } from "./player.object";

export class EggObject implements SceneObject {
  isRenderable = true;
  hasCollision = true;
  positionX = -1;
  positionY = -1;
  targetX = this.positionX;
  targetY = this.positionY;
  spriteX = 0;
  spriteY = 0;
  tileset = 'tileset_egg';

  // animation
  animations = {
    idle: [{x: 0, y: 0}, {x: 1, y: 0}]
  };
  animationTimer = 0;
  animationIndex = 0;

  // actions
  hatchTimer = 0;
  hatchTimerMax = 7; // 5 seconds to hatch

  constructor(
    private scene: Scene,
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>,
    private config: { positionX?: number, positionY?: number },
  ){
    this.positionX = this.config.positionX ?? 5;
    this.targetX = this.positionX;
    this.positionY = this.config.positionY ?? 5;
    this.targetY = this.positionY;
  }
  
  update(delta: number): void {
    this.updateAnimation(delta);
    this.updateHatch(delta);
  }

  render?(): void {
    RenderUtils.renderSprite(
      this.context,
      this.assets.images[this.tileset],
      this.animations.idle[this.animationIndex].x, // sprite x
      this.animations.idle[this.animationIndex].y, // sprite y
      this.positionX,
      this.positionY
    );
  }

  // TODO(smg): do timers need to be cleaned up?
  destroy?(): void {}

  private updateAnimation(delta: number): void {
    this.animationTimer = (this.animationTimer + delta) % 1;
    this.animationIndex = 0;
  }

  private updateHatch(delta: number): void {
    this.hatchTimer += delta;

    if(this.hatchTimer < this.hatchTimerMax){
      return;
    }

    let player = this.scene.getObjectsByType(PlayerObject)[0] as PlayerObject;
    let chicken = new ChickenObject(this.scene, this.context, this.assets, { positionX: this.positionX, positionY: this.positionY }, player);
      
    this.scene.removeObject(this);
    this.scene.addObject(chicken);
  }

}