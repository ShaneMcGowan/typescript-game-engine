import { SceneObject } from "../../../model/scene-object";
import { RenderUtils } from "../../../utils/render.utils";

export class SampleObject implements SceneObject {
  
  constructor(
    private context: CanvasRenderingContext2D,
    private assets: Record<string, any>
  ){
    document.addEventListener('keydown', (event) => {
      switch(event.key.toLocaleLowerCase()){
        case 'd':
          this.positionX += 1;
          this.spriteY = 2;
          break;
        case 'a':
          this.positionX -= 1;
          this.spriteY = 1;
          break;
        case 'w':
          this.positionY -= 1;
          this.spriteY = 3;
          break;
        case 's':
          this.positionY += 1;
          this.spriteY = 0;
          break;
      }
    });
  }

  collision: boolean;
  isRenderable: boolean;
  positionX = 10;
  positionY = 10;
  tileset = 'player';
  spriteX = 0;
  spriteY = 0;

  update?(): void {
    // throw new Error("Method not implemented.");
  }

  render?(): void {
    RenderUtils.renderSprite(
      this.context,
      this.assets.images[this.tileset],
      this.spriteX,
      this.spriteY,
      this.positionX,
      this.positionY
    );
  }

  destroy?(): void {
    // throw new Error("Method not implemented.");
  }

}