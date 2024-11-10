import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type InventoryItemObject } from '@game/objects/inventory-item.object';
import { RenderUtils } from '@core/utils/render.utils';
import { Input, MouseKey } from '@core/utils/input.utils';
import { ShopItemBuyObject } from './shop/shop-item-buy.object';
import { InventoryItemType } from '@game/models/inventory-item.model';
import { ShopItemSellObject } from './shop/shop-item-sell.object';
import { MouseUtils } from '@core/utils/mouse.utils';

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;
const DEFAULT_COLLISION_LAYER: number = CanvasConstants.UI_COLLISION_LAYER;

enum Controls {
  Close = 'tab',
}

interface Config extends SceneObjectBaseConfig {
  onLeave?: () => void;
}

const ITEMS_FOR_SALE: Array<{ type: InventoryItemType, price: number }> = [
  {
    type: InventoryItemType.TomatoSeeds,
    price: 5
  },
  {
    type: InventoryItemType.WheatSeeds,
    price: 5
  },
];


export class ShopObject extends SceneObject {
  renderLayer = DEFAULT_RENDER_LAYER;
  collisionLayer = DEFAULT_COLLISION_LAYER;

  onLeave?: () => void;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;

    this.onLeave = config.onLeave;
  }

  items: Array<ShopItemBuyObject | ShopItemSellObject> = []; // TODO: once SceneObject.children is implemented, replace this with it

  awake(): void {
    for (let i = 0; i < ITEMS_FOR_SALE.length; i++) {
      const item = ITEMS_FOR_SALE[i];
      this.items.push(new ShopItemBuyObject(this.scene, {
        positionX: this.transform.position.x + 2 + (i * 2.5),
        positionY: this.transform.position.y + 2,
        price: item.price,
        type: item.type,
      }));
    }

    // hotbar offset so player can't sell hotbar items
    const hotbarOffset = this.scene.globals.hotbar_size;
    const columnsPerRow = 5;
    const totalRows = 4;
    for (let col = 0; col < columnsPerRow; col++) {
      for (let row = 0; row < totalRows; row++) {

        const index = col + (row * columnsPerRow) + hotbarOffset;

        const item = this.inventory[index];
        if (item === undefined) {
          continue;
        }

        this.items.push(new ShopItemSellObject(this.scene, {
          positionX: this.transform.position.x + 19 + (col * 2.5),
          positionY: this.transform.position.y + 3 + (row * 2.5),
          item: item,
          index: index,
        }));
      }
    }

    this.items.forEach(item => this.scene.addObject(item));
  }

  update(delta: number): void {
    this.updateButtonClose();
    this.updateClickClose();
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderBackground(context);
    this.renderShopBackground(context);
    this.renderShopTitle(context);
    this.renderInventoryBackground(context);
    this.renderInventoryTitle(context);
    this.renderTotalGold(context);
    this.renderLeaveButton(context);
  }

  destroy(): void {

    // TODO: destroy all shop items, ideally this would be done via SceneObject.children and having them all be destroyed
    this.items.forEach(item => this.scene.removeObjectById(item.id));
  }

  get inventory(): InventoryItemObject[] {
    return this.scene.globals['inventory'];
  }

  get inventorySize(): number {
    return this.scene.globals['inventory_size'];
  }

  private updateButtonClose(): void {
    if (!Input.isKeyPressed(Controls.Close)) {
      return;
    }

    Input.clearKeyPressed(Controls.Close);

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
    this.scene.removeObjectById(this.id);

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
        type: 'tile'
      }
    )
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
        type: 'tile'
      }
    )
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
        type: 'tile'
      }
    );

    RenderUtils.renderText(
      context,
      `Shop (buy)`,
      6,
      1.25,
      { size: 12, colour: 'black', font: 'MS Gothic' }
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
        type: 'tile'
      }
    )
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
        type: 'tile'
      }
    );

    RenderUtils.renderText(
      context,
      `Inventory (sell)`,
      21,
      1.25,
      { size: 12, colour: 'black', font: 'MS Gothic' }
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
        type: 'tile'
      }
    );

    RenderUtils.renderText(
      context,
      `Gold: ${this.scene.globals.gold}`,
      27,
      13,
      { size: 12, colour: 'black', font: 'MS Gothic' }
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
        type: 'tile'
      }
    );

    RenderUtils.renderText(
      context,
      `Leave`,
      22.5,
      13,
      { size: 12, colour: 'black', font: 'MS Gothic' }
    );
  }

}
