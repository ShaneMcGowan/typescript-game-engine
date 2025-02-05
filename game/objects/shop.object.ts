import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { RenderUtils } from '@core/utils/render.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { ShopItemBuyObject } from './shop/shop-item-buy.object';
import { ShopItemSellObject } from './shop/shop-item-sell.object';
import { MouseUtils } from '@core/utils/mouse.utils';
import { type Inventory, ItemType } from '@game/models/inventory.model';
import { Control, CONTROL_SCHEME } from '@game/constants/controls.constants';

enum Controls {
  Close = 'tab'
}

interface Config extends SceneObjectBaseConfig {
  onLeave?: () => void;
}

const ITEMS_FOR_SALE: Array<{ type: ItemType; price: number; }> = [
  {
    type: ItemType.TomatoSeeds,
    price: 5,
  },
  {
    type: ItemType.WheatSeeds,
    price: 5,
  },
  {
    type: ItemType.Hoe,
    price: 50,
  },
  {
    type: ItemType.WateringCan,
    price: 50,
  },
  {
    type: ItemType.Chest,
    price: 500,
  }
];

export class ShopObject extends SceneObject {
  onLeave?: () => void;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER;
    this.collision.layer = CanvasConstants.UI_COLLISION_LAYER;

    this.onLeave = config.onLeave;
  }

  onAwake(): void {
    this.refreshShopState();
  }

  onUpdate(delta: number): void {
    this.updateButtonClose();
    this.updateClickClose();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderBackground(context);
    this.renderShopBackground(context);
    this.renderShopTitle(context);
    this.renderInventoryBackground(context);
    this.renderInventoryTitle(context);
    this.renderTotalGold(context);
    this.renderLeaveButton(context);
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get hotbar(): Inventory {
    return this.scene.globals.hotbar;
  }

  private updateButtonClose(): void {
    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.CloseShop)) {
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.CloseShop);

    this.close();
  }

  private updateClickClose(): void {
    if (!Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    if (!MouseUtils.isMouseWithinBoundary(
      Input.mouse.position,
      21.5,
      12,
      4.5,
      1.5
    )) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    this.close();
  }

  private close(): void {
    this.destroy();

    if (this.onLeave) {
      this.onLeave();
    }
  }

  private renderBackground(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      0,
      0,
      32,
      18,
      {
        colour: '#00000055',
        type: 'tile',
      }
    );
  }

  private renderShopBackground(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      1,
      1,
      14,
      10,
      {
        colour: 'brown',
        type: 'tile',
      }
    );
  }

  private renderShopTitle(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      4,
      0.25,
      8,
      1.5,
      {
        colour: 'goldenrod',
        type: 'tile',
      }
    );

    RenderUtils.renderText(
      context,
      'Shop (buy)',
      6,
      1.25
    );
  }

  private renderInventoryBackground(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      17,
      1,
      14,
      11.75,
      {
        colour: 'brown',
        type: 'tile',
      }
    );
  }

  private renderInventoryTitle(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      20,
      0.25,
      8,
      1.5,
      {
        colour: 'goldenrod',
        type: 'tile',
      }
    );

    RenderUtils.renderText(
      context,
      'Inventory (sell)',
      21,
      1.25
    );
  }

  private renderTotalGold(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      26.5,
      12,
      4.5,
      1.5,
      {
        colour: 'goldenrod',
        type: 'tile',
      }
    );

    RenderUtils.renderText(
      context,
      `Gold: ${this.scene.globals.gold}`,
      27,
      13
    );
  }

  private renderLeaveButton(context: CanvasRenderingContext2D) {
    RenderUtils.fillRectangle(
      context,
      21.5,
      12,
      4.5,
      1.5,
      {
        colour: 'grey',
        type: 'tile',
      }
    );

    RenderUtils.renderText(
      context,
      'Leave',
      22.5,
      13
    );
  }

  public refreshShopState(): void {
    // remove items
    this.removeAllChildren();

    // items to buy
    for (let i = 0; i < ITEMS_FOR_SALE.length; i++) {
      const item = ITEMS_FOR_SALE[i];

      const object = new ShopItemBuyObject(this.scene, {
        x: this.transform.position.world.x + 3 + (i * 2.5),
        y: this.transform.position.world.y + 3,
        price: item.price,
        type: item.type,
      });
      this.addChild(object);
    }

    // items to sell
    // hotbar offset so player can't sell hotbar items
    const hotbarOffset = this.hotbar.size;
    const columnsPerRow = 5;
    const totalRows = 4;
    for (let col = 0; col < columnsPerRow; col++) {
      for (let row = 0; row < totalRows; row++) {
        const index = col + (row * columnsPerRow) + hotbarOffset;

        const item = this.inventory.items[index];
        if (item === undefined) {
          continue;
        }

        const object = new ShopItemSellObject(this.scene, {
          x: this.transform.position.world.x + 19 + (col * 2.5),
          y: this.transform.position.world.y + 3 + (row * 2.5),
          type: item.type,
          count: item.currentStackSize,
          index,
        });
        this.addChild(object);
      }
    }
  }
}
