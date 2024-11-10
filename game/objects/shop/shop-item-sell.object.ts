import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { InventoryItemType } from "@game/models/inventory-item.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { InventoryItemObject, TYPE_TO_SELL_VALUE_MAP, TYPE_TO_SPRITE_MAP } from "../inventory-item.object";
import { MouseUtils } from "@core/utils/mouse.utils";
import { Input } from "@core/utils/input.utils";

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;

interface Config extends SceneObjectBaseConfig {
  item: InventoryItemObject;
  index: number;
}

export class ShopItemSellObject extends SceneObject {
  renderLayer = DEFAULT_RENDER_LAYER;

  width: number = 2;
  height: number = 2;

  item: InventoryItemObject;
  index: number;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;

    this.item = config.item;
    this.index = config.index;
  }

  update(delta: number): void {
    this.updateClicked();
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderContainer(context);
    this.renderItem(context);
    this.renderPrice(context);
    this.renderStackSize(context);
  }

  get type(): InventoryItemType {
    return this.item.type;
  }

  get price(): number {
    return TYPE_TO_SELL_VALUE_MAP[this.type];
  }

  private updateClicked(): void {
    if (!Input.isMousePressed()) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    Input.clearMousePressed();

    this.scene.globals.gold += this.price;

    console.log(this.scene.globals.gold);
    console.log(this.item.currentStackSize);

    this.scene.removeFromInventory(this.index);

    // last of an item being sold, remove from ui
    if (this.item.currentStackSize === 0) {
      this.scene.removeObjectById(this.id);
    }
  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.boundingBox.left,
      this.boundingBox.top,
      this.width,
      this.height,
      {
        colour: 'white',
        type: 'tile'
      }
    );
  }

  private renderItem(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[this.sprite.tileset],
      this.sprite.spriteX,
      this.sprite.spriteY,
      this.transform.position.x,
      this.transform.position.y,
      undefined,
      undefined,
      {
        centered: true
      }
    );
  }

  private renderPrice(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      `$${this.price}`,
      this.boundingBox.right - 0.75,
      this.boundingBox.bottom,
      { size: 12, colour: 'black', font: 'MS Gothic' }
    );
  }

  private renderStackSize(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      `${this.item.currentStackSize}`,
      this.boundingBox.right - 0.75,
      this.boundingBox.top + 0.75,
      { size: 12, colour: 'black', font: 'MS Gothic' }
    );
  }

  get sprite() {
    return TYPE_TO_SPRITE_MAP[this.type];
  }
}