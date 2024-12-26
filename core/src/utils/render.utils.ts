import { CanvasConstants } from '../constants/canvas.constants';

export abstract class RenderUtils {
  static renderSprite(
    context: CanvasRenderingContext2D,
    spriteSheet: HTMLImageElement, // TODO(shane): rather than having to call Assets.images[TILE_SET] all over the place when using this, change this to a user defined ENUM and call Assets.images[TILE_SET] internally, allowing for cleaner code and type safety
    spriteX: number,
    spriteY: number,
    positionX: number,
    positionY: number,
    spriteWidth?: number,
    spriteHeight?: number,
    options: { scale?: number; opacity?: number; type?: 'tile' | 'pixel'; rotation?: number; centered?: boolean; } = {} // TODO: implement tile vs pixel
  ): void {
    let width = spriteWidth ? spriteWidth * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;
    let height = spriteHeight ? spriteHeight * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;
    let scale = options.scale ?? 1; // use to scale the output
    let rotation = options.rotation ?? 0; // degrees to rotate the sprite by

    // save the current context if we need to apply opacity, then restore it after
    // we don't do this for all renders as it is a performance hit
    let updateOpacity = (options.opacity && options.opacity < 1);
    let updateRotation = (rotation !== 0);

    let shouldSave = (updateOpacity || updateRotation);
    if (shouldSave) {
      context.save();

      if (updateOpacity) {
        context.globalAlpha = Math.max(0, options.opacity);
      }

      if (updateRotation) {
        // translate to the center of the sprite, rotate, then translate back
        let xTranslation = Math.floor((positionX + (spriteWidth / 2)) * CanvasConstants.TILE_SIZE) + 0.5;
        let yTranslation = Math.floor((positionY + (spriteHeight / 2)) * CanvasConstants.TILE_SIZE) + 0.5;

        context.translate(xTranslation, yTranslation);
        // TODO: any angle that isn't 90, 180, 270, etc will cause blurring / weird sprite interoplation. This is a known issue with canvas and will need to see if this can be worked around
        context.rotate((rotation * Math.PI) / 180);
        context.translate(-xTranslation, -yTranslation);
      }
    }

    let translateX = Math.floor(width / 2);
    let translateY = Math.floor(height / 2);

    if (options.centered) {
      // context.translate(-translateX, -translateY);
    }

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

    if (options.centered) {
      // context.translate(translateX, translateY);
    }

    if (shouldSave) {
      context.restore();
    }
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

  // TODO: this is using a mixture of pixel and tile coordinates, need to standardize
  static fillRectangle(
    context: CanvasRenderingContext2D,
    positionX: number,
    positionY: number,
    width: number,
    height: number,
    options: { colour?: string; type?: 'pixel' | 'tile'; } = {}
  ): void {
    context.strokeStyle = options.colour ? options.colour : 'black';
    context.fillStyle = options.colour ? options.colour : 'black';
    context.beginPath();
    context.rect(
      Math.floor(positionX * CanvasConstants.TILE_SIZE) + 0.5, // +0.5 to prevent blurring but that causes additional issues
      Math.floor(positionY * CanvasConstants.TILE_SIZE) + 0.5, // +0.5 to prevent blurring but that causes additional issues
      (width * (options.type === 'tile' ? CanvasConstants.TILE_SIZE : 1)) - 1,
      (height * (options.type === 'tile' ? CanvasConstants.TILE_SIZE : 1)) - 1
    );
    context.stroke();
    context.fill();
  }

  static strokeRectangle(context: CanvasRenderingContext2D, positionX: number, positionY: number, width: number, height: number, options: { type?: 'pixel' | 'tile'; colour?: string; } = {}): void {
    context.strokeStyle = options.colour ?? 'black';
    // canvas renders on a half pixel so we need to offset by .5 in order to get the stroke width to be 1px, otherwise it was 2px wide https://stackoverflow.com/a/13879402
    context.lineWidth = 1;

    let x = options.type === 'tile' ? Math.floor(positionX * CanvasConstants.TILE_SIZE) : positionX;
    let y = options.type === 'tile' ? Math.floor(positionY * CanvasConstants.TILE_SIZE) : positionY;
    let w = options.type === 'tile' ? Math.floor(width * CanvasConstants.TILE_SIZE) : width;
    let h = options.type === 'tile' ? Math.floor(height * CanvasConstants.TILE_SIZE) : height;

    context.strokeRect(
      x + 0.5,
      y + 0.5,
      w - 1,
      h - 1
    );
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

  static getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    let context = canvas.getContext('2d');
    context.imageSmoothingEnabled = CanvasConstants.CONTEXT_IMAGE_SMOOTHING_ENABLED;

    return context;
  }

  static positionToPixelPosition(position: number): number {
    return position * CanvasConstants.TILE_SIZE;
  }

  static renderText(
    context: CanvasRenderingContext2D,
    text: string,
    positionX: number,
    positionY: number,
    options: { size?: number; colour?: string; font?: string; } = {}
  ): void {
    let size = options.size ? options.size : CanvasConstants.DEFAULT_FONT_SIZE;
    let colour = options.colour ? options.colour : CanvasConstants.DEFAULT_FONT_COLOUR;
    let font = options.font ? options.font : CanvasConstants.DEFAULT_FONT_FAMILY;

    context.font = `${size}px ${font}`;
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
    options: { size?: number; colour?: string; font?: string; } = {}
  ): string[] {
    // defaults
    let size = options.size ?? CanvasConstants.DEFAULT_FONT_SIZE;
    let colour = options.colour ?? CanvasConstants.DEFAULT_FONT_COLOUR;
    let font = options.font ? options.font : CanvasConstants.DEFAULT_FONT_FAMILY;

    // configure context
    let context = document.createElement('canvas').getContext('2d');
    context.font = `${size}px ${font}`;
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
      currentLine = updatedLine.trim();
    }
    return output;
  }
}
