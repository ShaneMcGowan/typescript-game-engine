import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SAMPLE_SCENE_1 } from '@game/scenes/1.scene';
import { type ChestObject } from '@game/scenes/1/objects/chest.object';
import { type InventoryItemObject } from '@game/scenes/1/objects/inventory-item.object';
import { MouseUtils } from '@core/utils/mouse.utils';
import { RenderUtils } from '@core/utils/render.utils';
import { Input } from '@core/utils/input.utils';

const DEFAULT_RENDER_LAYER: number = CanvasConstants.UI_RENDER_LAYER;
const DEFAULT_COLLISION_LAYER: number = CanvasConstants.UI_COLLISION_LAYER;
const INVENTORY_INDEX_TO_POSITION_MAP = [
  // hot bar
  { x: 6, y: 15, },
  { x: 8, y: 15, },
  { x: 10, y: 15, },
  { x: 12, y: 15, },
  { x: 14, y: 15, },
  { x: 16, y: 15, },
  { x: 18, y: 15, },
  { x: 20, y: 15, },
  { x: 22, y: 15, },
  // inventory - row 1
  { x: 6, y: 8, },
  { x: 8, y: 8, },
  { x: 10, y: 8, },
  { x: 12, y: 8, },
  { x: 14, y: 8, },
  { x: 16, y: 8, },
  { x: 18, y: 8, },
  { x: 20, y: 8, },
  { x: 22, y: 8, },
  // inventory - row 2
  { x: 6, y: 10, },
  { x: 8, y: 10, },
  { x: 10, y: 10, },
  { x: 12, y: 10, },
  { x: 14, y: 10, },
  { x: 16, y: 10, },
  { x: 18, y: 10, },
  { x: 20, y: 10, },
  { x: 22, y: 10, },
  // inventory - row 3
  { x: 6, y: 12, },
  { x: 8, y: 12, },
  { x: 10, y: 12, },
  { x: 12, y: 12, },
  { x: 14, y: 12, },
  { x: 16, y: 12, },
  { x: 18, y: 12, },
  { x: 20, y: 12, },
  { x: 22, y: 12, }
];

const CHEST_INDEX_TO_POSITION_MAP = [
  // chest - row 1
  { x: 6, y: 1, },
  { x: 8, y: 1, },
  { x: 10, y: 1, },
  { x: 12, y: 1, },
  { x: 14, y: 1, },
  { x: 16, y: 1, },
  { x: 18, y: 1, },
  { x: 20, y: 1, },
  { x: 22, y: 1, },
  // chest - row 2
  { x: 6, y: 3, },
  { x: 8, y: 3, },
  { x: 10, y: 3, },
  { x: 12, y: 3, },
  { x: 14, y: 3, },
  { x: 16, y: 3, },
  { x: 18, y: 3, },
  { x: 20, y: 3, },
  { x: 22, y: 3, },
  // chest - row 3
  { x: 6, y: 5, },
  { x: 8, y: 5, },
  { x: 10, y: 5, },
  { x: 12, y: 5, },
  { x: 14, y: 5, },
  { x: 16, y: 5, },
  { x: 18, y: 5, },
  { x: 20, y: 5, },
  { x: 22, y: 5, }
];

interface Config extends SceneObjectBaseConfig {

}

export class InventoryUiObject extends SceneObject {
  isRenderable = true;
  renderLayer = DEFAULT_RENDER_LAYER;
  collisionLayer = DEFAULT_COLLISION_LAYER;

  private showChest: boolean = false;
  private showInventory: boolean = false;
  private showHotbar: boolean = true;
  private chest: ChestObject | undefined = undefined;
  private itemHolding: { location: 'inventory' | 'chest'; item: InventoryItemObject; index: number; } | undefined = undefined;

  constructor(
    protected scene: SAMPLE_SCENE_1,
    config: Config
  ) {
    super(scene, config);

    // key listeners references
    this.keyListeners.onMouseDown = this.onMouseDown.bind(this);
    this.keyListeners.onMouseUp = this.onMouseUp.bind(this);

    // add listeners
    this.disableClickListeners();

    // add event listener
    this.scene.addEventListener(this.scene.eventTypes.TOGGLE_INVENTORY, this.onToggleInventory.bind(this));
    this.scene.addEventListener(this.scene.eventTypes.CHEST_OPENED, this.onChestOpened.bind(this));
    this.scene.addEventListener(this.scene.eventTypes.CHEST_CLOSED, this.onChestClosed.bind(this));
  }

  private onToggleInventory(event: CustomEvent): void {
    if (this.showInventory) {
      // close inventory
      this.disableClickListeners();
      this.scene.dispatchEvent(this.scene.eventTypes.INVENTORY_CLOSED);
    } else {
      // open inventory
      this.enableClickListeners();
      this.scene.dispatchEvent(this.scene.eventTypes.INVENTORY_OPENED);
    }

    this.showInventory = !this.showInventory;
  }

  private onChestOpened(event: CustomEvent): void {
    this.chest = event.detail.object;
    this.showChest = true;
    this.showInventory = true;
    this.showHotbar = true;
    this.enableClickListeners();
  }

  private onChestClosed(event: CustomEvent): void {
    this.chest = undefined;
    this.showChest = false;
    this.showInventory = false;
    this.showHotbar = true;
    this.disableClickListeners();
  }

  render(context: CanvasRenderingContext2D): void {
    // hotbar
    if (this.showHotbar) {
      let x = 6;
      let y = 15;
      this.renderInventoryBackground(context, x, y);
      this.renderInventoryContainers(context, x, y);
      this.renderInventoryItems(context, x, y, this.inventory.slice(0, this.hotbarSize));
      if (!this.showInventory) {
        this.renderHotbarSelector(context);
      }
    }

    // chest
    if (this.showChest) {
      this.renderChestHeader(context, 6, 0);
      for (let row = 0; row < 3; row++) {
        let x = 6;
        let y = 1 + (row * 2);
        this.renderInventoryBackground(context, x, y);
        this.renderInventoryContainers(context, x, y);
        this.renderInventoryItems(context, x, y, this.chest.inventory.slice(this.hotbarSize * row, this.hotbarSize * (row + 1)));
      }
    }

    // inventory
    if (this.showInventory) {
      this.renderInventoryHeader(context, 6, 7);
      for (let row = 0; row < 3; row++) {
        let x = 6;
        let y = 8 + (row * 2);
        this.renderInventoryBackground(context, x, y);
        this.renderInventoryContainers(context, x, y);
        this.renderInventoryItems(context, x, y, this.inventory.slice(this.hotbarSize * (row + 1), this.hotbarSize * (row + 2)));
      }
      // ensure this is rendered last as to not be behind any other ui
      this.renderInventoryItemGrabbed(context);
    }
  }

  private renderHotbarSelector(context: CanvasRenderingContext2D): void {
    const x = 6 + (this.hotbarSelectedIndex * 2);
    const y = 15;
    RenderUtils.renderSprite(
      context,
      this.assets.images.tileset_ui,
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
    let width = CanvasConstants.TILE_SIZE * 18;
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
    for (let i = 0; i < 9; i++) {
      RenderUtils.renderSprite(
        context,
        this.assets.images.tileset_ui,
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

  private onMouseDown(event: MouseEvent): void {
    let mousePosition = MouseUtils.getMousePosition(this.mainContext.canvas, event);
    // check inventory
    let indexInventory = this.getIndexFromPositionMap(mousePosition, INVENTORY_INDEX_TO_POSITION_MAP);
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
    let indexChest = this.getIndexFromPositionMap(mousePosition, CHEST_INDEX_TO_POSITION_MAP);
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

    this.itemHolding = undefined;
  }

  private onMouseUp(event: MouseEvent): void {
    if (this.itemHolding === undefined) {
      return;
    }

    let mousePosition = MouseUtils.getMousePosition(this.mainContext.canvas, event);

    // check inventory
    let indexInventory = this.getIndexFromPositionMap(mousePosition, INVENTORY_INDEX_TO_POSITION_MAP);
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
    let indexChest = this.getIndexFromPositionMap(mousePosition, CHEST_INDEX_TO_POSITION_MAP);
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

    this.itemHolding = undefined;
  }

  private enableClickListeners(): void {
    this.mainContext.canvas.addEventListener('mousedown', this.keyListeners.onMouseDown);
    this.mainContext.canvas.addEventListener('mouseup', this.keyListeners.onMouseUp);
  }

  private disableClickListeners(): void {
    this.mainContext.canvas.removeEventListener('mousedown', this.keyListeners.onMouseDown);
    this.mainContext.canvas.removeEventListener('mouseup', this.keyListeners.onMouseUp);
  }

  private renderInventoryItem(context: CanvasRenderingContext2D, tileset: string, stackSize: number, spriteX: number, spriteY: number, positionX: number, positionY: number): void {
    RenderUtils.renderSprite(
      context,
      this.assets.images[tileset],
      spriteX,
      spriteY,
      positionX,
      positionY
    );
    RenderUtils.renderText(
      context,
      `${stackSize}`,
      positionX + 0.75,
      positionY + 1,
      { size: 8, colour: 'black', }
    );
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
