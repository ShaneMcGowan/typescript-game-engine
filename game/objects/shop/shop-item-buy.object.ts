import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { InventoryItemType } from "@game/models/inventory-item.model";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { TYPE_TO_SPRITE_MAP } from "../inventory-item.object";
import { MouseUtils } from "@core/utils/mouse.utils";
import { Input, MouseKey } from "@core/utils/input.utils";
import { Assets } from "@core/utils/assets.utils";
import { ShopObject } from "../shop.object";


interface Config extends SceneObjectBaseConfig {
  type: InventoryItemType;
  price: number;
}

export class ShopItemBuyObject extends SceneObject {
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
    this.renderer.layer = CanvasConstants.UI_RENDER_LAYER;

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

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    if (this.price > this.scene.globals.gold) {
      return;
    }

    this.scene.globals.gold -= this.price;

    this.scene.addToInventory(this.type);

    (this.parent as ShopObject).refreshShopState();
  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    RenderUtils.fillRectangle(
      context,
      this.boundingBox.world.left,
      this.boundingBox.world.top,
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
      Assets.images[this.sprite.tileset],
      this.sprite.spriteX,
      this.sprite.spriteY,
      this.transform.position.world.x,
      this.transform.position.world.y,
      undefined,
      undefined,
      {centered: true}
    );
  }

  private renderPrice(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      `$${this.price}`,
      this.transform.position.world.x,
      this.transform.position.world.y + 1,
      { size: 12, colour: 'black', font: 'MS Gothic' }
    );
  }

  get sprite() {
    return TYPE_TO_SPRITE_MAP[this.type];
  }
}