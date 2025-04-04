import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { UiObject } from '@core/objects/ui.object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';

interface Config extends SceneObjectBaseConfig {
}

export class InventoryGoldCountObject extends SceneObject {
  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 1;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderGoldContainer(context);
    this.renderGoldValue(context);
  }

  private renderGoldContainer(context: CanvasRenderingContext2D): void {
    // const tileset = this.state === ButtonState.Default ? TilesetBasic.Button.White.Default : TilesetBasic.Button.White.Pressed;

    // RenderUtils.renderSprite(
    //   context,
    //   Assets.images[TilesetBasic.id],
    //   tileset.x,
    //   tileset.y,
    //   this.transform.position.world.x,
    //   this.transform.position.world.y,
    //   tileset.width,
    //   tileset.height,
    // );
  }

  private renderGoldValue(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      `Gold: ${this.scene.globals.gold}`,
      this.transform.position.world.x + (this.width / 2),
      this.transform.position.world.y,
      {
        colour: 'white',
        baseline: 'top',
        align: 'center',
      }
    );
  }
}
