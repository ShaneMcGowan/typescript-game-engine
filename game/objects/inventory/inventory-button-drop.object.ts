import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Assets } from '@core/utils/assets.utils';
import { TilesetBasic } from '@game/constants/tilesets/basic.tileset';
import { type InventoryObject } from './inventory.object';
import { MouseUtils } from '@core/utils/mouse.utils';
import { UiObject } from '@core/objects/ui.object';

interface Config extends SceneObjectBaseConfig {
}

export class InventoryButtonDropObject extends SceneObject {
  width: number = 2;
  height: number = 2;
  inventoryIndex: number;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 1;
  }

  onUpdate(delta: number): void {

  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderButtonContainer(context);
    this.renderButtonIcon(context);
  }

  private renderButtonContainer(context: CanvasRenderingContext2D): void {
    let tileset;

    if ((this.parent as InventoryObject).isDragging && MouseUtils.isMouseWithinObject(this)) {
      tileset = TilesetBasic.Button.White.Pressed;
    } else {
      tileset = TilesetBasic.Button.White.Default;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetBasic.id],
      tileset.x,
      tileset.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      tileset.width,
      tileset.height,
      { centered: true, }
    );
  }

  private renderButtonIcon(context: CanvasRenderingContext2D): void {
    const tileset = TilesetBasic.ArrowDown.White.Default;
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
      { centered: true, }
    );
  }
}
