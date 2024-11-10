import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChestObject } from '@game/objects/chest.object';
import { type InventoryItemObject } from '@game/objects/inventory-item.object';
import { RenderUtils } from '@core/utils/render.utils';
import { Input } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';

const INVENTORY_INDEX_TO_POSITION_MAP = [
  // hot bar
  { x: 11, y: 15, },
  { x: 13, y: 15, },
  { x: 15, y: 15, },
  { x: 17, y: 15, },
  { x: 19, y: 15, },

  // inventory - row 1
  { x: 11, y: 6, },
  { x: 13, y: 6, },
  { x: 15, y: 6, },
  { x: 17, y: 6, },
  { x: 19, y: 6, },

  // inventory - row 2
  { x: 11, y: 8, },
  { x: 13, y: 8, },
  { x: 15, y: 8, },
  { x: 17, y: 8, },
  { x: 19, y: 8, },

  // inventory - row 3
  { x: 11, y: 10, },
  { x: 13, y: 10, },
  { x: 15, y: 10, },
  { x: 17, y: 10, },
  { x: 19, y: 10, },

  // inventory - row 4
  { x: 11, y: 12, },
  { x: 13, y: 12, },
  { x: 15, y: 12, },
  { x: 17, y: 12, },
  { x: 19, y: 12, },
];

const CHEST_INDEX_TO_POSITION_MAP = [
  // chest - row 1
  { x: 7, y: 1, },
  { x: 9, y: 1, },
  { x: 11, y: 1, },
  { x: 13, y: 1, },
  { x: 15, y: 1, },
  { x: 17, y: 1, },
  { x: 19, y: 1, },
  { x: 21, y: 1, },
  { x: 23, y: 1, },
  // chest - row 2
  { x: 7, y: 3, },
  { x: 9, y: 3, },
  { x: 11, y: 3, },
  { x: 13, y: 3, },
  { x: 15, y: 3, },
  { x: 17, y: 3, },
  { x: 19, y: 3, },
  { x: 21, y: 3, },
  { x: 23, y: 3, },
  // chest - row 3
  { x: 7, y: 5, },
  { x: 9, y: 5, },
  { x: 11, y: 5, },
  { x: 13, y: 5, },
  { x: 15, y: 5, },
  { x: 17, y: 5, },
  { x: 19, y: 5, },
  { x: 21, y: 5, },
  { x: 23, y: 5, }
];

enum Controls {
  Close = 'tab',
}

interface Config extends SceneObjectBaseConfig {
  chest?: ChestObject
}

export class InventoryObject extends SceneObject {
  private showInventory: boolean = true;
  private showHotbar: boolean = true;
  private chest: ChestObject | undefined = undefined;
  private itemHolding: { location: 'inventory' | 'chest'; item: InventoryItemObject; index: number; } | undefined = undefined;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.UI_RENDER_LAYER;
    this.collision.layer = CanvasConstants.UI_COLLISION_LAYER;

    this.scene.globals.disable_player_inputs = true;
    this.chest = config.chest;
  }

  update(delta: number): void {
    this.updatePickUpItem();
    this.updateDropItem();
    this.updateClose();
  }

  render(context: CanvasRenderingContext2D): void {
    // hotbar
    if (this.showHotbar) {
      let x = 11;
      let y = 15;
      this.renderInventoryBackground(context, x, y);
      this.renderInventoryContainers(context, x, y);
      this.renderInventoryItems(context, x, y, this.inventory.slice(0, this.hotbarSize));
      if (!this.showInventory) {
        this.renderHotbarSelector(context);
      }
    }

    // chest
    if (this.chest) {
      this.renderChestHeader(context, 7, 0);
      for (let row = 0; row < 3; row++) {
        let x = 7;
        let y = 1 + (row * 2);
        this.renderInventoryBackground(context, x, y);
        this.renderInventoryContainers(context, x, y);
        this.renderInventoryItems(context, x, y, this.chest.inventory.slice(this.hotbarSize * row, this.hotbarSize * (row + 1)));
      }
    }

    // inventory
    if (this.showInventory) {
      this.renderInventoryHeader(context, 11, 5);
      for (let row = 0; row < 4; row++) {
        let x = 11;
        let y = 6 + (row * 2);
        this.renderInventoryBackground(context, x, y);
        this.renderInventoryContainers(context, x, y);
        this.renderInventoryItems(context, x, y, this.inventory.slice(this.hotbarSize * (row + 1), this.hotbarSize * (row + 2)));
      }
      // ensure this is rendered last as to not be behind any other ui
      this.renderInventoryItemGrabbed(context);
    }
  }

  destroy(): void {
    this.scene.globals.disable_player_inputs = false;
    if (this.chest) {
      this.chest.actionClose();
    }
  }

  private renderHotbarSelector(context: CanvasRenderingContext2D): void {
    const x = 11 + (this.hotbarSelectedIndex * 2);
    const y = 15;
    RenderUtils.renderSprite(
      context,
      Assets.images.tileset_ui,
      9,
      9,
      x,
      y,
      2,
      2
    );
  }

  private renderInventoryHeader(context: CanvasRenderingContext2D, positionX: number, positionY: number): void {
    let width = CanvasConstants.TILE_SIZE * 4;
    let height = CanvasConstants.TILE_SIZE * 2;
    RenderUtils.fillRectangle(
      context,
      positionX,
      positionY,
      width,
      height,
      { colour: 'saddlebrown', }
    );
    RenderUtils.renderText(
      context,
      'Inventory',
      positionX + 0.4,
      positionY + 0.75,
      { size: 12, colour: 'white', }
    );
  }

  private renderChestHeader(context: CanvasRenderingContext2D, positionX: number, positionY: number): void {
    let width = CanvasConstants.TILE_SIZE * 4;
    let height = CanvasConstants.TILE_SIZE * 2;
    RenderUtils.fillRectangle(
      context,
      positionX,
      positionY,
      width,
      height,
      { colour: 'saddlebrown', }

    );
    RenderUtils.renderText(
      context,
      'Chest',
      positionX + 0.9,
      positionY + 0.75,
      { size: 12, colour: 'white', }
    );
  }

  private renderInventoryBackground(context: CanvasRenderingContext2D, positionX: number, positionY: number): void {
    let width = CanvasConstants.TILE_SIZE * 2 * this.scene.globals.hotbar_size;
    let height = CanvasConstants.TILE_SIZE * 2;
    RenderUtils.fillRectangle(
      context,
      positionX,
      positionY,
      width,
      height,
      { colour: 'saddlebrown', }
    );
  }

  private renderInventoryContainers(context: CanvasRenderingContext2D, positionX: number, positionY: number): void {
    for (let i = 0; i < this.scene.globals.hotbar_size; i++) {
      RenderUtils.renderSprite(
        context,
        Assets.images.tileset_ui,
        0.5,
        3.5,
        positionX + (i * 2),
        positionY,
        2,
        2
      );
    }
  }

  private renderInventoryItems(context: CanvasRenderingContext2D, positionX: number, positionY: number, inventory: InventoryItemObject[]): void {
    for (let i = 0; i < 9; i++) {
      let item = inventory[i];
      if (item === undefined) {
        continue;
      }

      this.renderInventoryItem(
        context,
        item.sprite.tileset,
        item.currentStackSize,
        item.maxStackSize,
        item.sprite.spriteX,
        item.sprite.spriteY,
        (positionX + 0.5) + (i * 2),
        (positionY + 0.5)
      );
    }
  }

  private renderInventoryItemGrabbed(context: CanvasRenderingContext2D): void {
    if (this.itemHolding === undefined) {
      return;
    }

    let item = this.itemHolding.item;

    this.renderInventoryItem(
      context,
      item.sprite.tileset,
      item.currentStackSize,
      item.maxStackSize,
      item.sprite.spriteX,
      item.sprite.spriteY,
      Input.mouse.position.exactX - 0.5,
      Input.mouse.position.exactY - 0.5
    );
  }

  get inventory(): InventoryItemObject[] {
    return this.scene.globals['inventory'];
  }

  get inventorySize(): number {
    return this.scene.globals['inventory_size'];
  }

  get hotbarSize(): number {
    return this.scene.globals['hotbar_size'];
  }

  get hotbarSelectedIndex(): number {
    return this.scene.globals['hotbar_selected_index'];
  }

  private updatePickUpItem(): void {
    if (this.itemHolding !== undefined) {
      return;
    }

    // check inventory
    let indexInventory = this.getIndexFromPositionMap(Input.mouse.position, INVENTORY_INDEX_TO_POSITION_MAP);
    if (indexInventory !== undefined) {
      let item = this.inventory[indexInventory];
      if (item === undefined) {
        return;
      }

      this.itemHolding = {
        location: 'inventory',
        item,
        index: indexInventory,
      };
      return;
    }

    // check chest
    if (this.chest !== undefined) {
      let indexChest = this.getIndexFromPositionMap(Input.mouse.position, CHEST_INDEX_TO_POSITION_MAP);
      if (indexChest !== undefined) {
        let item = this.chest.inventory[indexChest];
        if (item === undefined) {
          return;
        }

        this.itemHolding = {
          location: 'chest',
          item,
          index: indexChest,
        };
        return;
      }
    }


    this.itemHolding = undefined;
  }

  private updateDropItem(): void {

    if (this.itemHolding === undefined) {
      return;
    }

    if (Input.mouse.click.left === true) {
      return;
    }

    // check inventory
    let indexInventory = this.getIndexFromPositionMap(Input.mouse.position, INVENTORY_INDEX_TO_POSITION_MAP);
    if (indexInventory !== undefined) {
      let temp = this.inventory[indexInventory];

      if (this.itemHolding.location === 'inventory') {
        this.inventory[indexInventory] = this.itemHolding.item;
        this.inventory[this.itemHolding.index] = temp;
      } else if (this.itemHolding.location === 'chest') {
        this.inventory[indexInventory] = this.itemHolding.item;
        this.chest.inventory[this.itemHolding.index] = temp;
      }
      this.itemHolding = undefined;
      return;
    }

    // check chest
    if (this.chest !== undefined) {
      let indexChest = this.getIndexFromPositionMap(Input.mouse.position, CHEST_INDEX_TO_POSITION_MAP);
      if (indexChest !== undefined) {
        let temp = this.chest.inventory[indexChest];

        if (this.itemHolding.location === 'inventory') {
          this.chest.inventory[indexChest] = this.itemHolding.item;
          this.inventory[this.itemHolding.index] = temp;
        } else if (this.itemHolding.location === 'chest') {
          this.chest.inventory[indexChest] = this.itemHolding.item;
          this.chest.inventory[this.itemHolding.index] = temp;
        }
        this.itemHolding = undefined;
        return;
      }
    }

    this.itemHolding = undefined;
  }

  private updateClose(): void {
    if (!Input.isKeyPressed(Controls.Close)) {
      return;
    }

    Input.clearKeyPressed(Controls.Close);

    this.scene.removeObjectById(this.id);
  }

  private renderInventoryItem(context: CanvasRenderingContext2D, tileset: string, stackSize: number, maxStackSize: number, spriteX: number, spriteY: number, positionX: number, positionY: number): void {
    RenderUtils.renderSprite(
      context,
      Assets.images[tileset],
      spriteX,
      spriteY,
      positionX,
      positionY
    );
    if (maxStackSize > 1) {
      RenderUtils.renderText(
        context,
        `${stackSize}`,
        positionX + 0.75,
        positionY + 1,
        { size: 8, colour: 'black', }
      );
    }
  }

  private getIndexFromPositionMap(mousePosition: { x: number; y: number; }, map: Array<{ x: number; y: number; }>): number | undefined {
    for (let i = 0; i < map.length; i++) {
      let position = map[i];
      if (
        mousePosition.x >= position.x &&
        mousePosition.x <= (position.x + 1) &&
        mousePosition.y >= position.y &&
        mousePosition.y <= (position.y + 1)
      ) {
        return i;
      }
    }

    return undefined;
  }
}
