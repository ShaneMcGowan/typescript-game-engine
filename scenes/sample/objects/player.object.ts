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
          this.spriteX = 1;
          this.spriteY = 10;
          break;
        case 'a':
          this.positionX -= 1;
          this.spriteX = 1;
          this.spriteY = 7;
          break;
        case 'w':
          this.positionY -= 1;
          this.spriteX = 1;
          this.spriteY = 4;
          break;
        case 's':
          this.positionY += 1;
          this.spriteX = 1;
          this.spriteY = 1;
          break;
      }
    });
  }

  isRenderable: boolean;
  positionX = 1;
  positionY = 1;
  tileset = 'tileset_player';
  spriteX = 1;
  spriteY = 1;

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