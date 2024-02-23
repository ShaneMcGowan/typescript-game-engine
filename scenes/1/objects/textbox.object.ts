import { CanvasConstants } from '@constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { RenderUtils } from '@utils/render.utils';

const TILE_SET: string = 'tileset_dialogue_box';

const SAMPLE_TEXT: string = 'The CanvasRenderingContext2D method fillText(), part of the Canvas 2D API, draws a text string at the specified coordinates, filling the string\'s characters with the current fillStyle. An optional parameter allows specifying a maximum width for the rendered text, which the user agent will achieve by condensing the text or by using a lower font size.';

interface Config extends SceneObjectBaseConfig {
  text?: string;
  portrait?: boolean;
}

export class TextboxObject extends SceneObject {
  isRenderable = true;

  height = 3;
  width = CanvasConstants.CANVAS_TILE_WIDTH;
  renderLayer = CanvasConstants.UI_RENDER_LAYER;

  // text box specific
  private readonly textboxWidth: number = CanvasConstants.CANVAS_TILE_WIDTH - 8;
  private readonly textboxBorder: number = 2;
  private readonly textSize: number = 10;
  private readonly text: string;
  private textSegments: string[] = [];
  private textIndex: number = 0;

  private readonly hasPortrait: boolean = false;
  // portrait animation - copied from ChickenObject
  animations = {
    idle: [{ x: 0, y: 0, }, { x: 1, y: 0, }],
  };

  animationTimer = 0;
  animationIndex = 0;

  private readonly controls = {
    confirm: false,
  };

  constructor(
    protected scene: SAMPLE_SCENE_1,
    protected config: Config
  ) {
    super(scene, config);

    if (config.positionX === undefined) {
      this.positionX = 0;
    }
    if (config.positionY === undefined) {
      this.positionY = CanvasConstants.CANVAS_TILE_HEIGHT - this.height; // bottom of canvas
    }

    if (config.text === undefined) {
      this.text = SAMPLE_TEXT;
    } else {
      this.text = config.text;
    }

    if (config.portrait) {
      this.hasPortrait = true;
    }

    // define listeners
    this.keyListeners.onConfirmKeyDown = this.onConfirmKeyDown.bind(this);

    // wire listeners
    document.addEventListener('keydown', this.keyListeners.onConfirmKeyDown);

    this.scene.dispatchEvent(this.scene.eventTypes.TEXTBOX_OPENED);

    this.initText();
  }

  initText(): void {
    // generate text segments
    this.textSegments = RenderUtils.textToArray(this.text, (this.textboxWidth - 4) * CanvasConstants.TILE_SIZE, { size: this.textSize, });
  }

  update(delta: number): void {
    this.updateConfirm();
    this.updatePortraitAnimation(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderOverlay(context);
    if (this.hasPortrait) {
      this.renderPortrait(context);
    }
    this.generateTextbox(context);
    this.renderText(context);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.keyListeners.onConfirmKeyDown);
    this.scene.dispatchEvent(this.scene.eventTypes.TEXTBOX_CLOSED);
  }

  private updateConfirm(): void {
    if (!this.controls.confirm) {
      return;
    }

    this.textIndex += 2;

    // destroy self as no more text
    if (this.textSegments.length <= this.textIndex) {
      this.scene.removeObject(this);
    }

    this.controls.confirm = false;
  }

  private renderOverlay(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      0,
      0,
      CanvasConstants.CANVAS_WIDTH,
      CanvasConstants.CANVAS_HEIGHT,
      { colour: 'rgba(0, 0, 0, 0.5)', }
    );
  }

  private generateTextbox(context: CanvasRenderingContext2D): void {
    let width = this.textboxWidth;
    let offset = (CanvasConstants.CANVAS_TILE_WIDTH - width) / 2;

    // left
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      0,
      0,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 4
    );
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      0,
      1,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 3
    );
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      0,
      1,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 2
    );
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      0,
      2,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 1
    );

    // columns
    for (let i = 1; i < width - 1; i++) {
      RenderUtils.renderSprite(
        context,
        this.assets.images[TILE_SET],
        1,
        0,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 4
      );
      RenderUtils.renderSprite(
        context,
        this.assets.images[TILE_SET],
        1,
        1,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 3
      );
      RenderUtils.renderSprite(
        context,
        this.assets.images[TILE_SET],
        1,
        1,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 2
      );
      RenderUtils.renderSprite(
        context,
        this.assets.images[TILE_SET],
        1,
        2,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 1
      );
    }

    // right
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      2,
      0,
      offset + width - 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 4
    );
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      2,
      1,
      offset + width - 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 3
    );
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      2,
      1,
      offset + width - 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 2
    );
    RenderUtils.renderSprite(
      context,
      this.assets.images[TILE_SET],
      2,
      2,
      offset + width - 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 1
    );
  }

  private renderText(context: CanvasRenderingContext2D): void {
    // line 1
    let line1Text = this.textSegments[this.textIndex];
    let line2Text = this.textSegments[this.textIndex + 1];

    if (line1Text) {
      RenderUtils.renderText(
        context,
        line1Text,
        ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1.25,
        CanvasConstants.CANVAS_TILE_HEIGHT - 2 - 0.25,
        { size: this.textSize, }
      );
    }

    if (line2Text) {
      RenderUtils.renderText(
        context,
        line2Text,
        ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1.25,
        CanvasConstants.CANVAS_TILE_HEIGHT - 1 - 0.25,
        { size: this.textSize, }
      );
    }
  }

  private renderPortrait(context: CanvasRenderingContext2D): void {
    let tileset = 'tileset_chicken';

    RenderUtils.renderSprite(
      context,
      this.assets.images[tileset],
      this.animations.idle[this.animationIndex].x,
      this.animations.idle[this.animationIndex].y,
      3,
      9,
      undefined,
      undefined,
      { scale: 8, }
    );
  }

  private updatePortraitAnimation(delta: number): void {
    this.animationTimer = (this.animationTimer + delta) % 4;
    if (this.animationTimer < 3.5) {
      this.animationIndex = 0;
    } else {
      this.animationIndex = 1;
    }
  }

  private onConfirmKeyDown(event: KeyboardEvent): void {
    // only accept first event
    if (event.repeat) {
      return;
    }

    switch (event.key.toLocaleLowerCase()) {
      case ' ':
        this.controls.confirm = true;
        break;
    }
  }
}