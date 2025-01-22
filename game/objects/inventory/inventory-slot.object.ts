import { CanvasConstants } from "@core/constants/canvas.constants";
import { SceneObject, SceneObjectBaseConfig } from "@core/model/scene-object";
import { RenderUtils } from "@core/utils/render.utils";
import { SCENE_GAME } from "@game/scenes/game/scene";
import { MouseUtils } from "@core/utils/mouse.utils";
import { Input, MouseKey } from "@core/utils/input.utils";
import { Assets } from "@core/utils/assets.utils";
import { InventoryObject } from "./inventory.object";
import { ItemSprite, Item, TYPE_TO_SPRITE_MAP, Inventory } from "@game/models/inventory.model";
import { TilesetUI } from "@game/constants/tilesets/ui.tileset";

export enum SlotType {
  Inventory = 'Inventory',
  ShopBuy = 'ShopBuy',
  ShopSell = 'ShopSell',
}

enum Controls {
  QuickMove = 'shift'
}

interface Config extends SceneObjectBaseConfig {
  otherInventory?: Inventory;
  index: number;
  type?: SlotType;
}

export class InventorySlotObject extends SceneObject {
  width: number = 2;
  height: number = 2;

  otherInventory?: Inventory;
  index: number;
  type: SlotType = SlotType.Inventory;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.collision.enabled = true;
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 1;

    this.otherInventory = config.otherInventory;
    this.index = config.index;
    this.type = config.type ?? this.type;
  }

  onUpdate(delta: number): void {
    this.updateClicked();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderContainer(context);
    this.renderItem(context);
    this.renderStackSize(context);
    this.renderValue(context);
  }

  private updateClicked(): void {
    // currently dragging
    if ((this.parent as InventoryObject).dragging !== undefined) {
      return;
    }

    if (!Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    if (!MouseUtils.isMouseWithinObject(this)) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    if (this.item === undefined) {
      return;
    }

    if(this.type === SlotType.Inventory){
      this.onClickInventory();
    } else if(this.type === SlotType.ShopBuy){
      this.onClickShopBuy();
    } else if(this.type === SlotType.ShopSell){
      this.onClickShopSell();
    }
  }

  private onClickInventory(): void {
    if (Input.isKeyPressed(Controls.QuickMove)) {
      (this.parent as InventoryObject).quickMove(this.otherInventory ? 'chest' : 'inventory', this.index);
    } else {
      (this.parent as InventoryObject).startDraggingItem('mouse', this.otherInventory ? 'chest' : 'inventory', this.index);
    }
  }

  private onClickShopBuy(): void {
    if(this.item === undefined){
      return;
    }

    // check if enough room
    if(!this.inventory.hasRoomForItem(this.item.type)){
      return;
    }

    // can afford
    const value = Inventory.getItemBuyValue(this.item.type);
    if(value > this.scene.globals.gold){
      return;
    }

    // deduct price
    this.scene.globals.gold -= value;

    // add item to inventory
    this.inventory.addToInventory(this.item.type);
  }

  private onClickShopSell(): void {
    if(this.item === undefined){
      return;
    }

    // can be sold
    if(!Inventory.canItemBeSold(this.item.type)){
      return;
    }

    // give price
    const value = Inventory.getItemSellValue(this.item.type);
    this.scene.globals.gold += value;

    // remove item from inventory
    this.inventory.removeFromInventoryByIndex(this.index, 1);
  }

  private renderContainer(context: CanvasRenderingContext2D): void {
    const tile = MouseUtils.isMouseWithinObject(this) ? TilesetUI.Container.Darker.Default : TilesetUI.Container.Default.Default;

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

    const opacity = (this.type === SlotType.ShopSell && !Inventory.canItemBeSold(this.item.type) ? 0.25 : 1)

    RenderUtils.renderSprite(
      context,
      Assets.images[this.sprite.tileset],
      this.sprite.x,
      this.sprite.y,
      this.transform.position.world.x + 0.5,
      this.transform.position.world.y + 0.5,
      1,
      1,
      { opacity: opacity }
    );
  }

  private renderStackSize(context: CanvasRenderingContext2D): void {
    if (this.item === undefined) {
      return;
    }

    if(this.type === SlotType.ShopBuy){
      return;
    }

    if (Inventory.getItemMaxStackSize(this.item.type) === 1) {
      return;
    }

    RenderUtils.renderText(
      context,
      `${this.item.currentStackSize}`,
      this.transform.position.world.x + 1.25,
      this.transform.position.world.y + 1.75,
    );
  }
  
  private renderValue(context: CanvasRenderingContext2D): void {
    if (this.item === undefined) {
      return;
    }
    
    if(this.type === SlotType.Inventory){
      return;
    }

    if(this.type === SlotType.ShopSell && !Inventory.canItemBeSold(this.item.type)){
      return;
    }

    const value = this.type === SlotType.ShopBuy ? Inventory.getItemBuyValue(this.item.type) : Inventory.getItemSellValue(this.item.type)

    RenderUtils.renderText(
      context,
      `$${value}`,
      this.transform.position.world.x + 0.25,
      this.transform.position.world.y + 0.75,
      {
        colour: 'black',
        align: 'left'
      }
    );
  }

  get item(): Item | undefined {
    if (this.otherInventory) {
      return this.otherInventory.items[this.index];
    }

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