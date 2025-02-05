import { type Scene } from '@core/model/scene';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { Assets } from '@core/utils/assets.utils';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { MouseUtils } from '@core/utils/mouse.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { TilesetButtons } from '@game/constants/tilesets/buttons.tileset';

interface Config extends SceneObjectBaseConfig { }

export class ButtonObject extends SceneObject {
  // config
  width = 6;
  height = 2;

  // state
  held: boolean = false;

  constructor(
    protected scene: Scene,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
  }

  onUpdate(): void {
    this.updateClickStart();
    this.updateClickEnd();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderButtonContainer(context);
    this.renderLabel(context);
  }

  get label(): string {
    return '';
  }

  get isHovering(): boolean {
    return MouseUtils.isMouseWithinObject(this);
  }

  private updateClickStart(): void {
    if (this.held) {
      return;
    }

    if (!Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    // ensure click started on the button
    if (Input.mouse.click.details === null) {
      return;
    }
    const isWithin = MouseUtils.isMouseWithinBoundary(
      Input.mouse.click.details.position,
      this.boundingBox.world.left,
      this.boundingBox.world.top,
      this.width,
      this.height
    );
    if (!isWithin) {
      return;
    }

    this.held = true;
  }

  private updateClickEnd(): void {
    if (!this.held) {
      return;
    }

    if (Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    this.held = false;

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    this.onClick();
  }

  private renderButtonContainer(context: CanvasRenderingContext2D): void {
    let state: 'Default' | 'Hover' | 'Pressed' = 'Default';
    if (this.isHovering) {
      state = 'Hover';
    }
    if (this.held) {
      state = 'Pressed';
    }

    // left
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetButtons.id],
      TilesetButtons.TopLeft.Default[state].x,
      TilesetButtons.TopLeft.Default[state].y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetButtons.TopLeft.Default[state].width,
      TilesetButtons.TopLeft.Default[state].height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetButtons.id],
      TilesetButtons.BottomLeft.Default[state].x,
      TilesetButtons.BottomLeft.Default[state].y,
      this.transform.position.world.x,
      this.transform.position.world.y + 1,
      TilesetButtons.BottomLeft.Default[state].width,
      TilesetButtons.BottomLeft.Default[state].height
    );

    for (let i = 1; i <= this.width - 2; i++) {
      // center
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetButtons.id],
        TilesetButtons.Top.Default[state].x,
        TilesetButtons.Top.Default[state].y,
        this.transform.position.world.x + i,
        this.transform.position.world.y,
        TilesetButtons.Top.Default[state].width,
        TilesetButtons.Top.Default[state].height
      );

      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetButtons.id],
        TilesetButtons.Bottom.Default[state].x,
        TilesetButtons.Bottom.Default[state].y,
        this.transform.position.world.x + i,
        this.transform.position.world.y + 1,
        TilesetButtons.Bottom.Default[state].width,
        TilesetButtons.Bottom.Default[state].height
      );
    }

    // right
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetButtons.id],
      TilesetButtons.TopRight.Default[state].x,
      TilesetButtons.TopRight.Default[state].y,
      this.transform.position.world.x + this.width - 1,
      this.transform.position.world.y,
      TilesetButtons.TopRight.Default[state].width,
      TilesetButtons.TopRight.Default[state].height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetButtons.id],
      TilesetButtons.BottomRight.Default[state].x,
      TilesetButtons.BottomRight.Default[state].y,
      this.transform.position.world.x + this.width - 1,
      this.transform.position.world.y + 1,
      TilesetButtons.BottomRight.Default[state].width,
      TilesetButtons.BottomRight.Default[state].height
    );
  }

  private renderLabel(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      this.label,
      this.centre.world.x,
      this.centre.world.y - (this.held ? 0 : 0.125),
      {
        align: 'center',
        baseline: 'middle',
      }
    );
  }

  onClick(): void {
  }
}
