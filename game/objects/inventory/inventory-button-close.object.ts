import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { UiObject } from '@core/objects/ui.object';

enum ButtonState {
  Default, // not pressed && colliding
  Down, // pressed && colliding
  Up // not pressed and colliding
}

interface Config extends SceneObjectBaseConfig {
}

export class InventoryButtonCloseObject extends SceneObject {
  width: number = 2;
  height: number = 2;
  inventoryIndex: number;

  state: ButtonState = ButtonState.Default;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 1;
  }

  onUpdate(delta: number): void {
    switch (this.state) {
      case ButtonState.Default:
        this.updateDefault();
        break;
      case ButtonState.Down:
        this.updateDown();
        break;
      case ButtonState.Up:
        this.updateUp();
        break;
    }
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderButtonContainer(context);
    this.renderButtonIcon(context);
  }

  private updateDefault(): void {
    if (!Input.isMousePressed()) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    this.state = ButtonState.Down;
  }

  private updateDown(): void {
    if (Input.isMousePressed()) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      this.state = ButtonState.Default;
      return;
    }

    this.state = ButtonState.Up;
  }

  private updateUp(): void {
    this.parent.destroy();
  }

  private renderButtonContainer(context: CanvasRenderingContext2D): void {
    const tileset = this.state === ButtonState.Default ? TilesetBasic.Button.White.Default : TilesetBasic.Button.White.Pressed;

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      tileset.x,
      tileset.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      tileset.width,
      tileset.height,
    );
  }

  private renderButtonIcon(context: CanvasRenderingContext2D): void {
    const tileset = this.state === ButtonState.Default ? TilesetBasic.Cross.Red.Default : TilesetBasic.Cross.Red.Pressed;
    const offset = this.calculateSpriteOffset(tileset.width, tileset.height);

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      tileset.x,
      tileset.y,
      this.transform.position.world.x + offset.x,
      this.transform.position.world.y + offset.y,
      tileset.width,
      tileset.height,
    );
  }
}
