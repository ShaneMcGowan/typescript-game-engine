import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { Control, CONTROL_SCHEME } from '@game/constants/controls.constants';

export interface Portrait {
  tileset: string;
  x: number;
  y: number;
}

enum Controls {
  Confirm = 'e',
  ConfirmAlt = ' ',
}

const TILE_SET: string = 'tileset_dialogue_box';
const DEFAULT_OVERLAY: boolean = true;
const DEFAULT_TEXT: string = '...';
const DEFAULT_ON_COMPLETE = (): void => { };
const DEFAULT_SCROLL_TEXT: boolean = true;
const DEFAULT_SCROLL_SPEED: number = 48;

interface Config extends SceneObjectBaseConfig {
  showOverlay?: boolean;
  text?: string;
  portrait?: Portrait;
  name?: string;
  onComplete?: () => void;
  completionDuration?: number;
  scrollText?: boolean;
  scrollSpeed?: number;
}

export class TextboxObject extends SceneObject {
  height = 3;
  width = CanvasConstants.CANVAS_TILE_WIDTH;

  // text box specific
  private readonly textboxWidth: number = CanvasConstants.CANVAS_TILE_WIDTH - 8;
  private readonly textboxBorder: number = 2;
  private readonly textSize: number = 16;
  private readonly text: string;
  private textSegments: string[] = [];
  private textIndex: number = 0; // index of textSegments
  private characterIndex: number = 0; // index of character of current text

  // text scroll
  private readonly scrollText: boolean;
  private readonly scrollSpeed: number;

  private readonly showOverlay: boolean;
  private readonly portrait: Portrait | undefined;
  private readonly name: string | undefined;

  // portrait animation - copied from ChickenObjeect
  // TODO: this is hard coded and no longer used, update it
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

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;

    if (config.positionX === undefined) {
      this.transform.position.local.x = 0;
    }
    if (config.positionY === undefined) {
      this.transform.position.local.y = CanvasConstants.CANVAS_TILE_HEIGHT - this.height; // bottom of canvas
    }

    this.showOverlay = config.showOverlay ?? DEFAULT_OVERLAY;
    this.text = config.text ?? DEFAULT_TEXT;
    this.onComplete = config.onComplete ?? DEFAULT_ON_COMPLETE;
    this.portrait = config.portrait;
    this.name = config.name;
    this.completionDuration = config.completionDuration;
    this.scrollText = config.scrollText ?? DEFAULT_SCROLL_TEXT;
    this.scrollSpeed = config.scrollSpeed ?? DEFAULT_SCROLL_SPEED;

    this.initText();
  }

  initText(): void {
    // generate text segments
    // TODO: what is 4 here?
    this.textSegments = RenderUtils.textToArray(this.text, (this.textboxWidth - 4) * CanvasConstants.TILE_SIZE, { size: this.textSize, });
  }

  onUpdate(delta: number): void {
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

  onRender(context: CanvasRenderingContext2D): void {
    if (this.showOverlay) {
      // this.renderOverlay(context);
      // TODO: overlay flickers between textbox objects, figure out a better pattern for this
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

  private updateTimer(delta: number): void {
    this.completionTimer += delta;

    if (this.completionTimer >= this.completionDuration) {
      if (this.onComplete) {
        this.onComplete();
      }
      this.destroy();
    }
  }

  private updateScrollText(delta: number): void {
    if (this.currentText.length > this.characterIndex) {
      this.characterIndex += this.scrollSpeed * delta;
    }
  }

  private updateConfirm(): void {
    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.Confirm)) {
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.Confirm);

    // if text is scrolling, scroll to end but don't go to next segment
    if (this.scrollText) {
      if (this.currentText.length > this.characterIndex) {
        this.characterIndex = this.currentText.length;
        Input.clearKeyPressed([Controls.Confirm, Controls.ConfirmAlt])
        Input.clearMousePressed(MouseKey.Left);
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
      this.destroy();
    }
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
      Assets.images[TILE_SET],
      0,
      0,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 4
    );
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      0,
      1,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 3
    );
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      0,
      1,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 2
    );
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      0,
      2,
      offset,
      CanvasConstants.CANVAS_TILE_HEIGHT - 1
    );

    // columns
    for (let i = 1; i < width - 1; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TILE_SET],
        1,
        0,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 4
      );
      RenderUtils.renderSprite(
        context,
        Assets.images[TILE_SET],
        1,
        1,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 3
      );
      RenderUtils.renderSprite(
        context,
        Assets.images[TILE_SET],
        1,
        1,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 2
      );
      RenderUtils.renderSprite(
        context,
        Assets.images[TILE_SET],
        1,
        2,
        offset + i,
        CanvasConstants.CANVAS_TILE_HEIGHT - 1
      );
    }

    // right
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      2,
      0,
      offset + width - 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 4
    );
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      2,
      1,
      offset + width - 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 3
    );
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
      2,
      1,
      offset + width - 1,
      CanvasConstants.CANVAS_TILE_HEIGHT - 2
    );
    RenderUtils.renderSprite(
      context,
      Assets.images[TILE_SET],
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
        { size: this.textSize }
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
    RenderUtils.renderSprite(
      context,
      Assets.images[this.portrait.tileset],
      this.portrait.x,
      this.portrait.y,
      // this.animations.idle[this.animationIndex].x,
      // this.animations.idle[this.animationIndex].y,
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
