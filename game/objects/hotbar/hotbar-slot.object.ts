import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { Assets } from "@core/utils/assets.utils";
import { ItemSprite, Item, TYPE_TO_SPRITE_MAP, Inventory } from "@game/models/inventory.model";
import { TilesetUI } from "@game/constants/tileset-ui.constants";

interface Config extends SceneObjectBaseConfig {
  index: number;
}

export class HotbarSlotObject extends SceneObject {
  width: number = 2;
  height: number = 2;

  index: number;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = false;
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 1;

    this.index = config.index;
  }

  onRender(context: CanvasRenderingContext2D): void {
    if (!this.scene.globals.player.enabled) {
      return;
    }

    if (!this.scene.globals.player.actionsEnabled) {
      return;
    }

    this.renderContainer(context);
    this.renderItem(context);
    this.renderStackSize(context);
    this.renderHotbarSelector(context);
  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    const tile = TilesetUI.Container.Default.Default;

    RenderUtils.renderSprite(
      context,
      Assets.images[TilesetUI.id],
      tile.x,
      tile.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      tile.width,
      tile.height,
      {
        centered: true,
      }
    );
  }

  private renderItem(context: CanvasRenderingContext2D): void {
    if (this.sprite === undefined) {
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.tileset],
      this.sprite.spriteX,
      this.sprite.spriteY,
      this.transform.position.world.x + 0.5,
      this.transform.position.world.y + 0.5,
      1,
      1,
      { centered: true }
    );
  }

  private renderStackSize(context: CanvasRenderingContext2D): void {
    if (this.item === undefined) {
      return;
    }

    if (this.item.maxStackSize === 1) {
      return;
    }

    RenderUtils.renderText(
      context,
      `${this.item.currentStackSize}`,
      this.transform.position.world.x + 1.25,
      this.transform.position.world.y + 1.75,
    );
  }

  private renderHotbarSelector(context: CanvasRenderingContext2D): void {
    if (this.scene.globals.hotbar_selected_index !== this.index) {
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images.tileset_ui,
      9,
      9,
      this.transform.position.world.x,
      this.transform.position.world.y,
      2,
      2,
    );
  }

  get item(): Item | undefined {
    return this.inventory.items[this.index];
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get sprite(): ItemSprite | undefined {
    if (this.item === undefined) {
      return undefined;
    }

    return TYPE_TO_SPRITE_MAP[this.item.type];
  }
}