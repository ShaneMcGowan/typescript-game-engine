import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { RenderUtils } from '@utils/render.utils';

const TILE_SET: string = 'tileset_dialogue_box';
const DEFAULT_OVERLAY: boolean = true;
const DEFAULT_TEXT: string = '...';
const DEFAULT_ON_COMPLETE = (): void => { };
const DEFAULT_SCROLL_TEXT: boolean = true;
const DEFAULT_SCROLL_SPEED: number = 48;

interface Config extends SceneObjectBaseConfig {
  showOverlay?: boolean;
  text?: string;
  portrait?: string;
  name?: string;
  onComplete?: () => void;
  completionDuration?: number;
  scrollText?: boolean;
  scrollSpeed?: number;
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
  private textIndex: number = 0; // index of textSegments
  private characterIndex: number = 0; // index of character of current text

  // text scroll
  private readonly scrollText: boolean;
  private readonly scrollSpeed: number;

  private readonly showOverlay: boolean;
  private readonly portrait: string | undefined;
  private readonly name: string | undefined;

  // portrait animation - copied from ChickenObject
  // TODO(smg): this is hard coded, update it
  private readonly animations = {
    idle: [{ x: 0, y: 0, }, { x: 1, y: 0, }],
  };

  private animationTimer: number = 0;
  private animationIndex: number = 0;

  // callback
  private readonly onComplete: (() => void);

  // completion
  private completionTimer: number = 0;
  private readonly completionDuration: number | undefined;

  private readonly controls = {
    confirm: false,
  };

  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    super(scene, config);

    if (config.positionX === undefined) {
      this.positionX = 0;
    }
    if (config.positionY === undefined) {
      this.positionY = CanvasConstants.CANVAS_TILE_HEIGHT - this.height; // bottom of canvas
    }

    this.showOverlay = config.showOverlay ?? DEFAULT_OVERLAY;
    this.text = config.text ?? DEFAULT_TEXT;
    this.onComplete = config.onComplete ?? DEFAULT_ON_COMPLETE;
    this.portrait = config.portrait;
    this.name = config.name;
    this.completionDuration = config.completionDuration;
    this.scrollText = config.scrollText ?? DEFAULT_SCROLL_TEXT;
    this.scrollSpeed = config.scrollSpeed ?? DEFAULT_SCROLL_SPEED;

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
    if (this.completionDuration !== undefined) {
      this.updateTimer(delta);
    } else {
      this.updateConfirm();
    }

    if (this.scrollText) {
      this.updateScrollText(delta);
    }

    this.updatePortraitAnimation(delta);
  }

  render(context: CanvasRenderingContext2D): void {
    if (this.showOverlay) {
      this.renderOverlay(context);
    }

    if (this.hasPortrait) {
      this.renderPortrait(context);
    }

    this.generateTextbox(context);

    if (this.hasNamePlate) {
      this.renderNamePlate(context);
    }

    this.renderText(context);
  }

  destroy(): void {
    document.removeEventListener('keydown', this.keyListeners.onConfirmKeyDown);
    this.scene.dispatchEvent(this.scene.eventTypes.TEXTBOX_CLOSED);
  }

  private updateTimer(delta: number): void {
    this.completionTimer += delta;

    if (this.completionTimer >= this.completionDuration) {
      if (this.onComplete) {
        this.onComplete();
      }
      this.scene.removeObject(this);
    }
  }

  private updateScrollText(delta: number): void {
    if (this.currentText.length > this.characterIndex) {
      this.characterIndex += this.scrollSpeed * delta;
    }
  }

  private updateConfirm(): void {
    if (!this.controls.confirm) {
      return;
    }

    // if text is scrolling, scroll to end but don't go to next segment
    if (this.scrollText) {
      if (this.currentText.length > this.characterIndex) {
        this.characterIndex = this.currentText.length;
        this.controls.confirm = false;
        return;
      }
    }

    this.textIndex += 2;

    this.characterIndex = 0;

    // destroy self as no more text
    if (this.textSegments.length <= this.textIndex) {
      if (this.onComplete) {
        this.onComplete();
      }
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
    if (this.textLine1) {
      let text = this.scrollText ? this.textLine1.substring(0, this.characterIndex) : this.textLine1;

      RenderUtils.renderText(
        context,
        text,
        ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1.25,
        CanvasConstants.CANVAS_TILE_HEIGHT - 2 - 0.25,
        { size: this.textSize, }
      );
    }

    if (this.textLine2) {
      let text = this.scrollText ? this.textLine2.substring(0, this.characterIndex - this.textLine1.length) : this.textLine2;

      RenderUtils.renderText(
        context,
        text,
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

  private renderNamePlate(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 4,
      6 * CanvasConstants.TILE_SIZE,
      1 * CanvasConstants.TILE_SIZE,
      { colour: '#e8cfa6', }
    );

    RenderUtils.renderText(
      context,
      this.name,
      ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1.25,
      CanvasConstants.CANVAS_TILE_HEIGHT - 3 - 0.25,
      { size: this.textSize, }
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

  get hasPortrait(): boolean {
    return this.portrait !== undefined;
  }

  get hasNamePlate(): boolean {
    return this.name !== undefined;
  }

  get textLine1(): string | undefined {
    return this.textSegments[this.textIndex];
  }

  get textLine2(): string | undefined {
    return this.textSegments[this.textIndex + 1];
  }

  get currentText(): string {
    let text = '';

    if (this.textLine1) {
      text += this.textLine1;
    }

    if (this.textLine2) {
      text += this.textLine2;
    }

    return text;
  }
}
