import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { Control, CONTROL_SCHEME } from '@game/constants/controls.constants';
import { TilesetDialogueBox } from '@game/constants/tilesets/dialogue-box.tileset';
import { PortraitObject } from './portrait.object';

export interface Portrait {
  tileset: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale?: number;
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
  height = 5;
  width = CanvasConstants.CANVAS_TILE_WIDTH;

  // text box specific
  private readonly textboxWidth: number = CanvasConstants.CANVAS_TILE_WIDTH - 8;
  private readonly textboxBorder: number = 2;
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
    this.textSegments = RenderUtils.textToArray(this.text, (this.textboxWidth - 4) * CanvasConstants.TILE_SIZE);
  }

  onAwake(): void {
    if(this.portrait){
      this.addChild(new PortraitObject(this.scene, { portrait: this.portrait }))
    }
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
    const width = this.textboxWidth;
    const offset = (CanvasConstants.CANVAS_TILE_WIDTH - width) / 2;

    // left
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.TopLeft.Default.Default.x,
      TilesetDialogueBox.TopLeft.Default.Default.y,
      this.transform.position.world.x + 0.5 + offset,
      this.transform.position.world.y + 1,
      TilesetDialogueBox.TopLeft.Default.Default.width,
      TilesetDialogueBox.TopLeft.Default.Default.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.Left.Default.Default.x,
      TilesetDialogueBox.Left.Default.Default.y,
      this.transform.position.world.x + 0.5 + offset,
      this.transform.position.world.y + 2,
      TilesetDialogueBox.Left.Default.Default.width,
      TilesetDialogueBox.Left.Default.Default.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.BottomLeft.Default.Default.x,
      TilesetDialogueBox.BottomLeft.Default.Default.y,
      this.transform.position.world.x + 0.5 + offset,
      this.transform.position.world.y + 3,
      TilesetDialogueBox.BottomLeft.Default.Default.width,
      TilesetDialogueBox.BottomLeft.Default.Default.height,
    );

    if(this.portrait){
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Notch.Default.Default.x,
        TilesetDialogueBox.Notch.Default.Default.y,
        this.transform.position.world.x + 0.5 + offset - 1 + (1 / 16), // move 1 pixel over for overlap
        this.transform.position.world.y + 2,
        TilesetDialogueBox.Notch.Default.Default.width,
        TilesetDialogueBox.Notch.Default.Default.height,
      );
    }

    // right
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.TopRight.Default.Default.x,
      TilesetDialogueBox.TopRight.Default.Default.y,
      this.transform.position.world.x + offset + width - 1.5,
      this.transform.position.world.y + 1,
      TilesetDialogueBox.TopRight.Default.Default.width,
      TilesetDialogueBox.TopRight.Default.Default.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.Right.Default.Default.x,
      TilesetDialogueBox.Right.Default.Default.y,
      this.transform.position.world.x + offset + width - 1.5,
      this.transform.position.world.y + 2,
      TilesetDialogueBox.Right.Default.Default.width,
      TilesetDialogueBox.Right.Default.Default.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.BottomRight.Default.Default.x,
      TilesetDialogueBox.BottomRight.Default.Default.y,
      this.transform.position.world.x + offset + width - 1.5,
      this.transform.position.world.y + 3,
      TilesetDialogueBox.BottomRight.Default.Default.width,
      TilesetDialogueBox.BottomRight.Default.Default.height,
    );

    // columns
    for (let i = 1; i < width - 1; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Top.Default.Default.x,
        TilesetDialogueBox.Top.Default.Default.y,
        offset + i,
        this.transform.position.world.y + 1,
        TilesetDialogueBox.Top.Default.Default.width,
        TilesetDialogueBox.Top.Default.Default.height,
      )

      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Centre.Default.Default.x,
        TilesetDialogueBox.Centre.Default.Default.y,
        offset + i,
        this.transform.position.world.y + 2,
        TilesetDialogueBox.Centre.Default.Default.width,
        TilesetDialogueBox.Centre.Default.Default.height,
      );

      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Bottom.Default.Default.x,
        TilesetDialogueBox.Bottom.Default.Default.y,
        offset + i,
        this.transform.position.world.y + 3,
        TilesetDialogueBox.Bottom.Default.Default.width,
        TilesetDialogueBox.Bottom.Default.Default.height,
      );
    }
  }

  private renderText(context: CanvasRenderingContext2D): void {
    
    if (this.textLine1) {
      let text = this.scrollText ? this.textLine1.substring(0, this.characterIndex) : this.textLine1;

      RenderUtils.renderText(
        context,
        text,
        ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1.25,
        this.textLine2 ? this.transform.position.world.y + 2.25 : this.transform.position.world.y + 2.75,
      );
    }

    if (this.textLine2) {
      let text = this.scrollText ? this.textLine2.substring(0, this.characterIndex - this.textLine1.length) : this.textLine2;

      RenderUtils.renderText(
        context,
        text,
        ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1.25,
        this.transform.position.world.y + 3.25,
      );
    }
  }

  private renderNamePlate(context: CanvasRenderingContext2D): void {
    const x = ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1;

    // left
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.TopLeft.Default.Default.x,
      TilesetDialogueBox.TopLeft.Default.Default.y,
      this.transform.position.world.x + x - 0.5,
      this.transform.position.world.y - 1,
      TilesetDialogueBox.TopLeft.Default.Default.width,
      TilesetDialogueBox.TopLeft.Default.Default.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.BottomLeft.Default.Default.x,
      TilesetDialogueBox.BottomLeft.Default.Default.y,
      this.transform.position.world.x + x - 0.5,
      this.transform.position.world.y - 0.5,
      TilesetDialogueBox.BottomLeft.Default.Default.width,
      TilesetDialogueBox.BottomLeft.Default.Default.height,
    );

    // center
    for(let i = 0; i < 5; i++){
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Top.Default.Default.x,
        TilesetDialogueBox.Top.Default.Default.y,
        this.transform.position.world.x + x + i + 0.5,
        this.transform.position.world.y - 1,
        TilesetDialogueBox.Top.Default.Default.width,
        TilesetDialogueBox.Top.Default.Default.height,
      );
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Bottom.Default.Default.x,
        TilesetDialogueBox.Bottom.Default.Default.y,
        this.transform.position.world.x + x + i + 0.5,
        this.transform.position.world.y - 0.5,
        TilesetDialogueBox.Bottom.Default.Default.width,
        TilesetDialogueBox.Bottom.Default.Default.height,
      );
    }

    // right
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.TopRight.Default.Default.x,
      TilesetDialogueBox.TopRight.Default.Default.y,
      this.transform.position.world.x + x + 6 - 0.5,
      this.transform.position.world.y - 1,
      TilesetDialogueBox.TopRight.Default.Default.width,
      TilesetDialogueBox.TopRight.Default.Default.height,
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.BottomRight.Default.Default.x,
      TilesetDialogueBox.BottomRight.Default.Default.y,
      this.transform.position.world.x + x + 6 - 0.5,
      this.transform.position.world.y - 0.5,
      TilesetDialogueBox.BottomRight.Default.Default.width,
      TilesetDialogueBox.BottomRight.Default.Default.height,
    );

    RenderUtils.renderText(
      context,
      this.name,
      ((CanvasConstants.CANVAS_TILE_WIDTH - this.textboxWidth) / 2) + 1.25,
      this.transform.position.world.y - 0.125,
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
