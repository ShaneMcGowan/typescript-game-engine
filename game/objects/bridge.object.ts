import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { Assets } from '@core/utils/assets.utils';
import { TilesetWoodenBridge } from '@game/constants/tileset-wooden-bridge.constants';

type Type = 'horizontal' | 'vertical';
interface Config extends SceneObjectBaseConfig {
  type: Type;
}

export class BridgeObject extends SceneObject {

  type: Type;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = 0;

    this.type = config.type;
  }

  onUpdate(delta: number): void {

  }

  onRender(context: CanvasRenderingContext2D): void {
    if (this.type === 'vertical') {
      this.renderTop(context);
      this.renderMiddle(context);
      this.renderBottom(context);
    } else if (this.type === 'horizontal') {

    }
  }

  private renderTop(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetWoodenBridge.id],
      TilesetWoodenBridge.Vertical.Default.Top.x,
      TilesetWoodenBridge.Vertical.Default.Top.y,
      this.boundingBox.world.left,
      this.boundingBox.world.top,
      TilesetWoodenBridge.Vertical.Default.Top.width,
      TilesetWoodenBridge.Vertical.Default.Top.height,
      {
        opacity: this.renderer.opacity,
      }
    );
  }

  private renderMiddle(context: CanvasRenderingContext2D): void {
    // skip top and bottom
    if (this.height <= 2) {
      return;
    }

    for (let i = 0; i < this.height - 2; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetWoodenBridge.id],
        TilesetWoodenBridge.Vertical.Default.Middle.x,
        TilesetWoodenBridge.Vertical.Default.Middle.y,
        this.boundingBox.world.left,
        this.boundingBox.world.top + 1 + i,
        TilesetWoodenBridge.Vertical.Default.Middle.width,
        TilesetWoodenBridge.Vertical.Default.Middle.height,
        {
          opacity: this.renderer.opacity,
        }
      );
    }

  }

  private renderBottom(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetWoodenBridge.id],
      TilesetWoodenBridge.Vertical.Default.Bottom.x,
      TilesetWoodenBridge.Vertical.Default.Bottom.y,
      this.boundingBox.world.left,
      this.boundingBox.world.bottom - 1,
      TilesetWoodenBridge.Vertical.Default.Bottom.width,
      TilesetWoodenBridge.Vertical.Default.Bottom.height,
      {
        opacity: this.renderer.opacity,
      }
    );
  }

  private renderLadderBottom(context: CanvasRenderingContext2D): void {

  }

  private renderLadderCenter(context: CanvasRenderingContext2D): void {

  }

}
