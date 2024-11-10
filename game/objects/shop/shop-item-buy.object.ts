import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { InventoryItemType } from "@game/models/inventory-item.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { TYPE_TO_SPRITE_MAP } from "../inventory-item.object";
import { MouseUtils } from "@core/utils/mouse.utils";
import { Input } from "@core/utils/input.utils";

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;

interface Config extends SceneObjectBaseConfig {
  type: InventoryItemType;
  price: number;
}

export class ShopItemBuyObject extends SceneObject {
  renderLayer = DEFAULT_RENDER_LAYER;

  width: number = 2;
  height: number = 2;

  price: number;
  type: InventoryItemType;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;

    this.price = config.price;
    this.type = config.type;
  }

  update(delta: number): void {
    this.updateClicked();
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderContainer(context);
    this.renderItem(context);
    this.renderPrice(context);
  }

  private updateClicked(): void {
    if (!Input.isMousePressed()) {
      return;
    }

    console.log('updateClicked');

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    console.log('updateClicked');

    Input.clearMousePressed();

    if (this.price > this.scene.globals.gold) {
      return;
    }

    console.log('updateClicked');

    this.scene.globals.gold -= this.price;

    console.log('updateClicked');

    this.scene.addToInventory(this.type);
  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.x,
      this.transform.position.y,
      this.width,
      this.height,
      {
        colour: 'white',
        type: 'tile'
      }
    );
  }

  private renderItem(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.transform.position.x,
      this.transform.position.y,
      this.width,
      this.height,
      {
        colour: 'white',
        type: 'tile'
      }
    );

    RenderUtils.renderSprite(
      context,
      this.assets.images[this.sprite.tileset],
      this.sprite.spriteX,
      this.sprite.spriteY,
      this.transform.position.x,
      this.transform.position.y,
      undefined,
      undefined,
    );
  }

  private renderPrice(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      `$${this.price}`,
      this.transform.position.x + 1,
      this.transform.position.y + 2,
      { size: 12, colour: 'black', font: 'MS Gothic' }
    );
  }

  get sprite() {
    return TYPE_TO_SPRITE_MAP[this.type];
  }
}