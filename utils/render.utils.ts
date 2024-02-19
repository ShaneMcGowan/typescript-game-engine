import { CanvasConstants } from '../constants/canvas.constants';

export class RenderUtils {
  static renderSprite(context: CanvasRenderingContext2D, spriteSheet: HTMLImageElement, spriteX: number, spriteY: number, positionX: number, positionY: number, spriteWidth?: number, spriteHeight?: number, options: { scale?: number; } = { }): void {
    let width = spriteWidth ? spriteWidth * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;
    let height = spriteHeight ? spriteHeight * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;
    let scale = options.scale ? options.scale : 1; // use to scale the output

    context.drawImage(
      spriteSheet,
      spriteX * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      spriteY * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      width,
      height,
      Math.floor(positionX * CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
      Math.floor(positionY * CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
      width * scale,
      height * scale
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

  static renderCircle(context: CanvasRenderingContext2D, positionX: number, positionY: number, options: { colour?: string; } = {}): void {
    context.beginPath();
    context.arc(
      (positionX * CanvasConstants.TILE_SIZE) + (CanvasConstants.TILE_SIZE / 2),
      (positionY * CanvasConstants.TILE_SIZE) + (CanvasConstants.TILE_SIZE / 2),
      CanvasConstants.TILE_SIZE / 2,
      0,
      2 * Math.PI
    );
    context.stroke();
    context.fillStyle = options.colour || 'saddlebrown';
    context.fill();
  }

  static fillRectangle(
    context: CanvasRenderingContext2D,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    options: { colour: string; } = { colour: 'black', }
  ): void {
    context.strokeStyle = options.colour;
    context.fillStyle = options.colour;
    context.beginPath();
    context.rect(
      positionX * CanvasConstants.TILE_SIZE,
      positionY * CanvasConstants.TILE_SIZE,
      width,
      height
    );
    context.stroke();
    context.fill();
  }

  static strokeRectangle(context: CanvasRenderingContext2D, positionX: number, positionY: number, width: number, height: number, colour?: string): void {
    context.strokeStyle = colour || 'black';
    // canvas renders on a half pixel so we need to offset by .5 in order to get the stroke width to be 1px, otherwise it was 2px wide https://stackoverflow.com/a/13879402
    context.lineWidth = 1;
    context.strokeRect(positionX + 0.5, positionY + 0.5, width - 1, height - 1);
  }

  static clearCanvas(context: CanvasRenderingContext2D): void {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  static createCanvas(width?: number, height?: number): HTMLCanvasElement {
    // create canvas
    const canvas = document.createElement('canvas');

    // configure canvas
    canvas.width = width ? width * CanvasConstants.TILE_SIZE : CanvasConstants.CANVAS_WIDTH;
    canvas.height = height ? height * CanvasConstants.TILE_SIZE : CanvasConstants.CANVAS_HEIGHT;

    return canvas;
  }

  static positionToPixelPosition(position: number): number {
    return position * CanvasConstants.TILE_SIZE;
  }

  static renderText(
    context: CanvasRenderingContext2D,
    text: string,
    positionX: number,
    positionY: number,
    options: { size?: number; colour?: string; } = {}
  ): void {
    let size = options.size ? options.size : 16;
    let colour = options.colour ? options.colour : 'black';

    context.font = `${size}px Helvetica`;
    context.fillStyle = `${colour}`;
    context.fillText(
      text,
      positionX * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      positionY * CanvasConstants.TILE_SIZE // translate sprite position to pixel position
    );
  }

  static textToArray(
    text: string,
    width: number,
    options: { size?: number; colour?: string; } = {}
  ): string[] {
    // defaults
    let size = options.size ? options.size : 16;
    let colour = options.colour ? options.colour : 'black';

    // configure context
    let context = document.createElement('canvas').getContext('2d');
    context.font = `${size}px Helvetica`;
    context.fillStyle = `${colour}`;

    // split words then create new line once exceeding width
    let words = text.split(' ');
    let currentLine = '';
    let output = [];

    for (let i = 0; i < words.length; i++) {
      let updatedLine = `${currentLine} ${words[i]}`;

      // width exceeded, end line
      if (context.measureText(updatedLine).width >= width) {
        output.push(updatedLine);
        currentLine = '';
        continue;
      }

      // final word, end line
      if (words.length - 1 === i) {
        output.push(updatedLine);
        continue;
      }

      // no exit condition, store new line
      currentLine = updatedLine;
    }
    return output;
  }
}
