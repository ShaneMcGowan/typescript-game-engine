import { CanvasConstants } from '../constants/canvas.constants';

export class RenderUtils {
  static renderSprite(context: CanvasRenderingContext2D, spriteSheet: HTMLImageElement, spriteX: number, spriteY: number, positionX: number, positionY: number, spriteWidth?: number, spriteHeight?: number): void {
    let width = spriteWidth ? spriteWidth * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;
    let height = spriteHeight ? spriteHeight * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;

    context.drawImage(
      spriteSheet,
      spriteX * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      spriteY * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      width,
      height,
      Math.floor(positionX * CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
      Math.floor(positionY * CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
      width,
      height
    );
  }

  static renderSubsection(
    source: CanvasRenderingContext2D,
    destination: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    let startXPixel = Math.floor(startX * CanvasConstants.TILE_SIZE);
    let startYPixel = Math.floor(startY * CanvasConstants.TILE_SIZE);
    let endXPixel = Math.floor(endX * CanvasConstants.TILE_SIZE);
    let endYPixel = Math.floor(endY * CanvasConstants.TILE_SIZE);

    destination.drawImage(
      source.canvas,
      startXPixel,
      startYPixel,
      endXPixel - startXPixel,
      endYPixel - startYPixel,
      0,
      0,
      destination.canvas.width,
      destination.canvas.height
    );
  }

  static renderCircle(context: CanvasRenderingContext2D, positionX: number, positionY: number): void {
    context.beginPath();
    context.arc(
      (positionX * CanvasConstants.TILE_SIZE) + (CanvasConstants.TILE_SIZE / 2),
      (positionY * CanvasConstants.TILE_SIZE) + (CanvasConstants.TILE_SIZE / 2),
      CanvasConstants.TILE_SIZE / 2,
      0,
      2 * Math.PI
    );
    context.stroke();
    context.fillStyle = 'saddlebrown';
    context.fill();
  }

  static clearCanvas(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  static createCanvas(width?: number, height?: number): HTMLCanvasElement {
    // create canvas
    const canvas = document.createElement('canvas');

    // configure canvas
    canvas.getContext('2d').imageSmoothingEnabled = false;
    canvas.width = width ? width * CanvasConstants.TILE_SIZE : CanvasConstants.CANVAS_WIDTH;
    canvas.height = height ? height * CanvasConstants.TILE_SIZE : CanvasConstants.CANVAS_HEIGHT;

    return canvas;
  }

  static positionToPixelPosition(position: number): number {
    return position * CanvasConstants.TILE_SIZE;
  }
}
