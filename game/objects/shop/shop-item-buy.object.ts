import { CanvasConstants } from '@core/constants/canvas.constants';
import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { RenderUtils } from '@core/utils/render.utils';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { MouseUtils } from '@core/utils/mouse.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { type ShopObject } from '../shop.object';
import { type Inventory, type ItemType, TYPE_TO_SPRITE_MAP } from '@game/models/inventory.model';

interface Config extends SceneObjectBaseConfig {
  type: ItemType;
  price: number;
}

export class ShopItemBuyObject extends SceneObject {
  width: number = 2;
  height: number = 2;

  price: number;
  type: ItemType;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;

    this.price = config.price;
    this.type = config.type;
  }

  onUpdate(delta: number): void {
    this.updateClicked();
  }

  onRender(context: CanvasRenderingContext2D): void {
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

    const item = this.inventory.addToInventory(this.type);

    if (item) {
      this.scene.globals.gold -= this.price;
    } else {
      // TODO: some sort of indication that the player has no room
    }

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
        type: 'tile',
      }
    );
  }

  private renderItem(context: CanvasRenderingContext2D): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.tileset],
      this.sprite.x,
      this.sprite.y,
      this.transform.position.world.x,
      this.transform.position.world.y,
      undefined,
      undefined,
    );
  }

  private renderPrice(context: CanvasRenderingContext2D): void {
    RenderUtils.renderText(
      context,
      `$${this.price}`,
      this.transform.position.world.x,
      this.transform.position.world.y + 1
    );
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get sprite() {
    return TYPE_TO_SPRITE_MAP[this.type];
  }
}
