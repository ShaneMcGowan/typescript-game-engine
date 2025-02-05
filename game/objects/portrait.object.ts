import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Assets } from '@core/utils/assets.utils';
import { TilesetUI } from '@game/constants/tilesets/ui.tileset';
import { type Portrait } from './textbox.object';

interface Config extends SceneObjectBaseConfig {
  portrait: Portrait;
}

export class PortraitObject extends SceneObject {
  private readonly portrait: Portrait | undefined;

  // portrait animation - copied from ChickenObjeect
  // TODO: this is hard coded and no longer used, update it
  private readonly animations = {
    idle: [{ x: 0, y: 0, }, { x: 1, y: 0, }],
  };

  private animationTimer: number = 0;
  private animationIndex: number = 0;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;

    this.portrait = config.portrait;
    this.width = 2 + this.portrait.width; // 2 is for the border
    this.height = 2 + this.portrait.height; // 2 is for the border
    // TODO: update local position so that portrait is centered
  }

  onUpdate(delta: number): void {
    this.updatePortraitAnimation(delta);
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderPortraitContainer(context);
    this.renderPortrait(context);
  }

  private renderPortrait(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.portrait.tileset],
      this.portrait.x,
      this.portrait.y,
      this.transform.position.world.x + 1,
      this.transform.position.world.y + 1,
      this.portrait.width,
      this.portrait.height,
      {
        // scale: this.portrait.scale ?? 1,
        // centered: this.portrait.scale !== undefined
      }
    );
  }

  private renderPortraitContainer(context: CanvasRenderingContext2D): void {
    // top
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetUI.id],
      TilesetUI.PortraitContainer.Darker.TopLeft.x,
      TilesetUI.PortraitContainer.Darker.TopLeft.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      TilesetUI.PortraitContainer.Darker.TopLeft.width,
      TilesetUI.PortraitContainer.Darker.TopLeft.height
    );

    for (let i = 0; i < this.width - 2; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetUI.id],
        TilesetUI.PortraitContainer.Darker.Top.x,
        TilesetUI.PortraitContainer.Darker.Top.y,
        this.transform.position.world.x + 1 + i,
        this.transform.position.world.y,
        TilesetUI.PortraitContainer.Darker.Top.width,
        TilesetUI.PortraitContainer.Darker.Top.height
      );
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetUI.id],
      TilesetUI.PortraitContainer.Darker.TopRight.x,
      TilesetUI.PortraitContainer.Darker.TopRight.y,
      this.transform.position.world.x + this.width - 1,
      this.transform.position.world.y,
      TilesetUI.PortraitContainer.Darker.TopRight.width,
      TilesetUI.PortraitContainer.Darker.TopRight.height
    );

    // center

    for (let i = 0; i < this.height - 2; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetUI.id],
        TilesetUI.PortraitContainer.Darker.Left.x,
        TilesetUI.PortraitContainer.Darker.Left.y,
        this.transform.position.world.x,
        this.transform.position.world.y + 1 + i,
        TilesetUI.PortraitContainer.Darker.Left.width,
        TilesetUI.PortraitContainer.Darker.Left.height
      );
    }

    for (let h = 0; h < this.height - 2; h++) {
      for (let w = 0; w < this.width - 2; w++) {
        RenderUtils.renderSprite(
          context,
          Assets.images[TilesetUI.id],
          TilesetUI.PortraitContainer.Darker.Centre.x,
          TilesetUI.PortraitContainer.Darker.Centre.y,
          this.transform.position.world.x + 1 + w,
          this.transform.position.world.y + 1 + h,
          TilesetUI.PortraitContainer.Darker.Centre.width,
          TilesetUI.PortraitContainer.Darker.Centre.height
        );
      }
    }

    for (let i = 0; i < this.height - 2; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetUI.id],
        TilesetUI.PortraitContainer.Darker.Right.x,
        TilesetUI.PortraitContainer.Darker.Right.y,
        this.transform.position.world.x + this.width - 1,
        this.transform.position.world.y + 1 + i,
        TilesetUI.PortraitContainer.Darker.Right.width,
        TilesetUI.PortraitContainer.Darker.Right.height
      );
    }

    // bottom
    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetUI.id],
      TilesetUI.PortraitContainer.Darker.BottomLeft.x,
      TilesetUI.PortraitContainer.Darker.BottomLeft.y,
      this.transform.position.world.x,
      this.transform.position.world.y + this.height - 1,
      TilesetUI.PortraitContainer.Darker.BottomLeft.width,
      TilesetUI.PortraitContainer.Darker.BottomLeft.height
    );

    for (let i = 0; i < this.width - 2; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images[TilesetUI.id],
        TilesetUI.PortraitContainer.Darker.Bottom.x,
        TilesetUI.PortraitContainer.Darker.Bottom.y,
        this.transform.position.world.x + i + 1,
        this.transform.position.world.y + this.height - 1,
        TilesetUI.PortraitContainer.Darker.Bottom.width,
        TilesetUI.PortraitContainer.Darker.Bottom.height
      );
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetUI.id],
      TilesetUI.PortraitContainer.Darker.BottomRight.x,
      TilesetUI.PortraitContainer.Darker.BottomRight.y,
      this.transform.position.world.x + this.width - 1,
      this.transform.position.world.y + this.height - 1,
      TilesetUI.PortraitContainer.Darker.BottomRight.width,
      TilesetUI.PortraitContainer.Darker.BottomRight.height
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
}
