import { CanvasConstants } from "../constants/canvas.constants";

export class RenderUtils {
  static renderSprite(context: CanvasRenderingContext2D, spriteSheet: HTMLImageElement, spriteX: number, spriteY: number, positionX: number, positionY: number): void{ 
    context.drawImage(
      spriteSheet,
      spriteX * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      spriteY * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      CanvasConstants.TILE_SIZE,
      CanvasConstants.TILE_SIZE,
      positionX * CanvasConstants.TILE_SIZE, // translate grid position to pixel position
      positionY * CanvasConstants.TILE_SIZE, // translate grid position to pixel position
      CanvasConstants.TILE_SIZE,
      CanvasConstants.TILE_SIZE
    );
  }
}