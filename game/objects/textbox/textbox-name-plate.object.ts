import { type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Assets } from '@core/utils/assets.utils';
import { TilesetDialogueBox } from '@game/constants/tilesets/dialogue-box.tileset';
import { UiObject } from '@core/objects/ui.object';
import { CanvasConstants } from '@core/constants/canvas.constants';

interface Config extends SceneObjectBaseConfig {
  name: string;
}

export class TextboxNamePlateObject extends UiObject {
  // config
  name: string;
  height = 1.5;

  // state

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.name = config.name;
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderContainer(context);
    this.renderName(context);
  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    // left
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.TopLeft.Default.Default.x,
      TilesetDialogueBox.TopLeft.Default.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetDialogueBox.TopLeft.Default.Default.width,
      TilesetDialogueBox.TopLeft.Default.Default.height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.BottomLeft.Default.Default.x,
      TilesetDialogueBox.BottomLeft.Default.Default.y,
      this.transform.position.world.x,
      this.transform.position.world.y + 0.5,
      TilesetDialogueBox.BottomLeft.Default.Default.width,
      TilesetDialogueBox.BottomLeft.Default.Default.height
    );

    // center
    for (let i = 1; i < this.width - 1; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Top.Default.Default.x,
        TilesetDialogueBox.Top.Default.Default.y,
        this.transform.position.world.x + i,
        this.transform.position.world.y,
        TilesetDialogueBox.Top.Default.Default.width,
        TilesetDialogueBox.Top.Default.Default.height
      );
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetDialogueBox.id],
        TilesetDialogueBox.Bottom.Default.Default.x,
        TilesetDialogueBox.Bottom.Default.Default.y,
        this.transform.position.world.x + i,
        this.transform.position.world.y + 0.5,
        TilesetDialogueBox.Bottom.Default.Default.width,
        TilesetDialogueBox.Bottom.Default.Default.height
      );
    }

    // right
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.TopRight.Default.Default.x,
      TilesetDialogueBox.TopRight.Default.Default.y,
      this.transform.position.world.x + this.width - 1,
      this.transform.position.world.y,
      TilesetDialogueBox.TopRight.Default.Default.width,
      TilesetDialogueBox.TopRight.Default.Default.height
    );

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetDialogueBox.id],
      TilesetDialogueBox.BottomRight.Default.Default.x,
      TilesetDialogueBox.BottomRight.Default.Default.y,
      this.transform.position.world.x + this.width - 1,
      this.transform.position.world.y + 0.5,
      TilesetDialogueBox.BottomRight.Default.Default.width,
      TilesetDialogueBox.BottomRight.Default.Default.height
    );
  }

  private renderName(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      this.name,
      this.centre.world.x,
      this.centre.world.y + (CanvasConstants.TILE_PIXEL_SIZE * 2),
      {
        align: 'center',
      }
    );
  }
}
