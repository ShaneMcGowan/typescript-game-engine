import { CanvasConstants } from '../constants/canvas.constants';

export abstract class RenderUtils {
  static renderSprite(
    context: CanvasRenderingContext2D,
    spriteSheet: HTMLImageElement, // TODO(shane): rather than having to call Assets.images[TILE_SET] all over the place when using this, change this to a user defined ENUM and call Assets.images[TILE_SET] internally, allowing for cleaner code and type safety
    spriteX: number,
    spriteY: number,
    x: number,
    y: number,
    spriteWidth?: number,
    spriteHeight?: number,
    options: { scale?: number; opacity?: number; type?: 'tile' | 'pixel'; rotation?: number; } = {} // TODO: implement tile vs pixel
  ): void {
    if (spriteSheet === undefined) {
      throw new Error("[RenderUtils.renderSprite] spriteSheet is undefined");
    }
    const width = spriteWidth ? spriteWidth * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;
    const height = spriteHeight ? spriteHeight * CanvasConstants.TILE_SIZE : CanvasConstants.TILE_SIZE;
    const scale = options.scale ?? 1; // use to scale the output
    const rotation = options.rotation ?? 0; // degrees to rotate the sprite by
    const opacity = options.opacity ?? 1;

    // save the current context if we need to apply opacity, then restore it after
    // we don't do this for all renders as it is a performance hit
    const updateOpacity = (opacity < 1);
    const updateRotation = (rotation !== 0);

    const shouldSave = (updateOpacity || updateRotation);

    if (shouldSave) {
      context.save();

      if (updateOpacity) {
        context.globalAlpha = Math.max(0, options.opacity);
        console.log('context.globalAlpha', context.globalAlpha);
      }

      if (updateRotation) {
        // translate to the center of the sprite, rotate, then translate back
        const xTranslation = Math.floor((x + (spriteWidth / 2)) * CanvasConstants.TILE_SIZE) + 0.5;
        const yTranslation = Math.floor((y + (spriteHeight / 2)) * CanvasConstants.TILE_SIZE) + 0.5;

        context.translate(xTranslation, yTranslation);
        // TODO: any angle that isn't 90, 180, 270, etc will cause blurring / weird sprite interoplation. This is a known issue with canvas and will need to see if this can be worked around
        context.rotate((rotation * Math.PI) / 180);
        context.translate(-xTranslation, -yTranslation);
      }
    }

    context.drawImage(
      spriteSheet,
      spriteX * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      spriteY * CanvasConstants.TILE_SIZE, // translate sprite position to pixel position
      width,
      height,
      Math.floor(x * CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
      Math.floor(y * CanvasConstants.TILE_SIZE), // translate grid position to pixel position, rounded to nearest pixel to prevent blurring
      width * scale,
      height * scale
    );

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

  static renderCircle(context: CanvasRenderingContext2D, x: number, y: number, options: { colour?: string; width?: number; } = {}): void {
    const radius = ((options.width * CanvasConstants.TILE_SIZE) / 2);

    context.beginPath();
    context.arc(
      (x * CanvasConstants.TILE_SIZE) + (CanvasConstants.TILE_SIZE / 2),
      (y * CanvasConstants.TILE_SIZE) + (CanvasConstants.TILE_SIZE / 2),
      radius,
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
    x: number,
    y: number,
    width: number,
    height: number,
    options: { colour?: string; type?: 'pixel' | 'tile'; } = {}
  ): void {
    context.strokeStyle = options.colour ? options.colour : 'black';
    context.fillStyle = options.colour ? options.colour : 'black';
    context.beginPath();
    context.rect(
      Math.floor(x * CanvasConstants.TILE_SIZE) + 0.5, // +0.5 to prevent blurring but that causes additional issues
      Math.floor(y * CanvasConstants.TILE_SIZE) + 0.5, // +0.5 to prevent blurring but that causes additional issues
      (width * (options.type === 'tile' ? CanvasConstants.TILE_SIZE : 1)) - 1,
      (height * (options.type === 'tile' ? CanvasConstants.TILE_SIZE : 1)) - 1
    );
    // context.stroke();
    context.fill();
  }

  static strokeRectangle(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, options: { type?: 'pixel' | 'tile'; colour?: string; } = {}): void {
    context.strokeStyle = options.colour ?? 'black';
    // canvas renders on a half pixel so we need to offset by .5 in order to get the stroke width to be 1px, otherwise it was 2px wide https://stackoverflow.com/a/13879402
    context.lineWidth = 1;

    x = options.type === 'tile' ? Math.floor(x * CanvasConstants.TILE_SIZE) : x;
    y = options.type === 'tile' ? Math.floor(y * CanvasConstants.TILE_SIZE) : y;
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
    x: number,
    y: number,
    options: {
      size?: number;
      colour?: string;
      font?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
      direction?: CanvasDirection;
    } = {}
  ): void {
    const size = options.size ?? CanvasConstants.DEFAULT_FONT_SIZE;
    const colour = options.colour ?? CanvasConstants.DEFAULT_FONT_COLOUR;
    const font = options.font ?? CanvasConstants.DEFAULT_FONT_FAMILY;
    const align = options.align ?? CanvasConstants.DEFAULT_TEXT_ALIGN;
    const baseline = options.baseline ?? CanvasConstants.DEFAULT_TEXT_BASELINE;
    const direction = options.direction ?? CanvasConstants.DEFAULT_TEXT_DIRECTION;

    context.font = `${size}px ${font}`;
    context.fillStyle = `${colour}`;
    context.textAlign = align;
    context.textBaseline = baseline;
    context.direction = direction;
    context.textRendering = 'geometricPrecision';

    x = x * CanvasConstants.TILE_SIZE; // translate tile position to pixel position
    y = y * CanvasConstants.TILE_SIZE; // translate tile position to pixel position

    context.fillText(
      text,
      x,
      y
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

    // trim output
    output = output.map(value => value.trim());

    return output;
  }

  /**
 * returns the text width in pixels
 * @param text
 * @param options 
 * @returns 
 */
  static measureText(text: string, options: {
    size?: number;
    colour?: string;
    font?: string;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    direction?: CanvasDirection;
  } = {}): number {
    // TODO: this is copied from Render text, as is the options signature, make this generic
    const size = options.size ?? CanvasConstants.DEFAULT_FONT_SIZE;
    const colour = options.colour ?? CanvasConstants.DEFAULT_FONT_COLOUR;
    const font = options.font ?? CanvasConstants.DEFAULT_FONT_FAMILY;
    const align = options.align ?? CanvasConstants.DEFAULT_TEXT_ALIGN;
    const baseline = options.baseline ?? CanvasConstants.DEFAULT_TEXT_BASELINE;
    const direction = options.direction ?? CanvasConstants.DEFAULT_TEXT_DIRECTION;

    // configure context
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${size}px ${font}`;
    context.fillStyle = `${colour}`;

    return context.measureText(text).width;
  }
}
