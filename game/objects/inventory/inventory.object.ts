import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { ChestObject } from '@game/objects/world-objects/chest.object';
import { RenderUtils } from '@core/utils/render.utils';
import { GamepadKey, Input, MouseKey } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { InventorySlotObject } from './inventory-slot.object';
import { ObjectFilter } from '@core/model/scene';
import { FillObject } from '@core/objects/fill.object';
import { InventoryButtonCloseObject } from './inventory-button-close.object';
import { Inventory, Item } from '@game/models/inventory.model';
import { InventoryButtonTrashObject } from './inventory-button-trash.object';
import { Control, CONTROL_SCHEME } from '@game/constants/controls.constants';
import { InventoryTooltipObject } from './inventory-tooltip.object';
import { InventoryButtonDropObject } from './inventory-button-drop.object';
import { ItemObject } from '../item.object';
import { PlayerObject } from '../player.object';
import { DeviceType } from '@core/model/device-type';

type DraggingSource = 'inventory' | 'chest';
type DraggingType = 'mouse' | 'controller';

interface Config extends SceneObjectBaseConfig {
  player?: PlayerObject;
  // chest?: ChestObject;
  
  otherInventory?: Inventory;
  onClose?: () => void;
}

interface Grid {
  columns: number;
  rows: number;
  positions: { x: number; y: number; }[][];
  selector: {
    x: 0,
    y: 0,
  }
}

export class InventoryObject extends SceneObject {
  private player?: PlayerObject;

  otherInventory?: Inventory;
  onClose?: () => void;

  private grid: Grid;
  private gridPosition: { x: number, y: number } = { x: 0, y: 0 };

  dragging: {
    type: DraggingType;
    item: Item;
    index: number;
    source: DraggingSource;
  } | undefined;

  private tooltip: InventoryTooltipObject | undefined;

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 2;
    this.collision.layer = CanvasConstants.UI_COLLISION_LAYER;

    this.player = config.player;
    this.otherInventory = config.otherInventory;
    this.onClose = config.onClose;
  }

  onAwake(): void {
    this.scene.globals.player.enabled = false; // we disable it here in onAwake as there are some callbacks that reenable this after object creation.

    this.grid = {
      columns: 0,
      rows: 0,
      selector: {
        x: 0,
        y: 0,
      },
      positions: []
    };

    const slots = [];

    // inventory size
    const rows = CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? 5 : 7;
    const columns = CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? 5 : 4;

    const rowsChest = this.otherInventory ? this.otherInventory.rows : 0;
    const columnsChest = this.otherInventory ? this.otherInventory.columns : 0;
    // inventory slots
    const width = 2;
    const height = 2;
    const gap = (columns + 1) * width;

    const rowsTotal = rows + (this.otherInventory ? rowsChest + 1 : 0); // 1 is a gap
    const columnsTotal = columns + (this.otherInventory ? columnsChest + 1 : 0); // 1 is a gap

    const marginTopInventory = ((CanvasConstants.CANVAS_TILE_HEIGHT - (rows * height)) / 2);
    const marginTopChest = ((CanvasConstants.CANVAS_TILE_HEIGHT - (rowsChest * height)) / 2);
    const marginLeft = ((CanvasConstants.CANVAS_TILE_WIDTH - (columnsTotal * width)) / 2);

    // configure grid
    this.grid.rows = rows;
    this.grid.columns = columns;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {

        // initialise position array
        if (column === 0) {
          this.grid.positions[row] = [];
        }

        const index = (row * columns) + column;

        const positionX = marginLeft + (column * width);
        const positionY = marginTopInventory + (row * height);

        // store position
        this.grid.positions[row][column] = { x: positionX, y: positionY };


        // skip extra slots rendered by grid, mainly for mobile
        if (index >= this.scene.globals.inventory.size) {
          continue;
        }

        slots.push(
          new InventorySlotObject(this.scene, {
            x: positionX,
            y: positionY,
            index: index
          })
        );
      }
    }

    for (let row = 0; row < rowsChest; row++) {
      for (let column = 0; column < columnsChest; column++) {
        const index = (row * columnsChest) + column;

        if (this.otherInventory) {
          slots.push(
            new InventorySlotObject(this.scene, {
              x: marginLeft + gap + (column * width),
              y: marginTopChest + (row * height),
              index: index,
              otherInventory: this.otherInventory
            })
          );
        }
      }
    }

    slots.forEach(slot => this.addChild(slot));

    const buttons = [
      new InventoryButtonCloseObject(this.scene, {}),
      ...(this.player ? [new InventoryButtonTrashObject(this.scene, {})] : []),
      ...(this.player ? [new InventoryButtonDropObject(this.scene, {})] : []),
    ];

    const x = CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? CanvasConstants.CANVAS_TILE_WIDTH - 3 : CanvasConstants.CANVAS_TILE_WIDTH - 3;
    const y = CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? 1 : CanvasConstants.CANVAS_TILE_HEIGHT - 3;

    buttons.forEach((button, index) => {
      button.transform.position.local.x = x - (index * 2);
      button.transform.position.local.y = y;
      this.addChild(button);
    });

    this.addChild(new FillObject(this.scene, {
      x: 0,
      y: 0,
      hexColourCode: '#00000099',
      width: CanvasConstants.CANVAS_TILE_WIDTH,
      height: CanvasConstants.CANVAS_TILE_HEIGHT
    }));
  }

  onUpdate(delta: number): void {
    this.updateStopMouseDragging();

    this.updateMouseAddTooltip();
    this.updateMouseRemoveTooltip();

    this.updateControllerGridPosition();
    this.updateControllerQuickMove();
    this.updateControllerStopDragging();
    this.updateControllerStartDragging();

    this.updateClose();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderMouseInventoryItem(context);
    this.renderMouseInventoryItemStackSize(context);

    this.renderControllerInventoryItem(context);
    this.renderControllerInventoryItemStackSize(context);
    this.renderControllerInventorySelector(context);
  }

  onDestroy(): void {
    this.stopDraggingItem();
    this.scene.globals.player.enabled = true;
    if (this.onClose) {
      this.onClose();
    }
  }

  get isDragging(): boolean {
    return this.dragging !== undefined;
  }

  get inventory(): Inventory {
    return this.scene.globals.inventory;
  }

  get controllerSelectorPosition(): { x: number, y: number } | undefined {
    return this.grid.positions[this.gridPosition.y][this.gridPosition.x]
  }

  private updateStopMouseDragging(): void {
    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.type !== 'mouse') {
      return;
    }

    if (!Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    Input.clearMousePressed(MouseKey.Left);

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        Input.mouse.position.x,
        Input.mouse.position.y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      ),
      typeMatch: [InventorySlotObject, InventoryButtonTrashObject, InventoryButtonDropObject]
    };

    const slot = this.scene.getObject(filter);
    if (slot === undefined) {
      this.stopDraggingItem();
    } else if (slot instanceof InventoryButtonTrashObject) {
      if (Inventory.canItemBeDestroyed(this.dragging.item.type)) {
        // destroy
        this.dragging = undefined;
      } else {
        this.stopDraggingItem();
      }
    } else if (slot instanceof InventoryButtonDropObject) {
      if (Inventory.canItemBeDropped(this.dragging.item.type)) {
        // drop
        for (let i = 0; i < this.dragging.item.currentStackSize; i++) {
          const item = new ItemObject(
            this.scene,
            {
              x: this.player?.transform.position.world.x || 0,
              y: this.player?.transform.position.world.y || 0,
              type: this.dragging.item.type,
              dropped: true,
            }
          );
          this.scene.addObject(item);
        }

        this.dragging = undefined;
      } else {
        this.stopDraggingItem();
      }
    } else if (slot instanceof InventorySlotObject) {
      // swap
      const source = this.dragging.source === 'inventory' ? this.inventory : this.otherInventory;
      const target = slot.otherInventory === undefined ? this.inventory : this.otherInventory;

      source.items[this.dragging.index] = target.items[slot.index];
      target.items[slot.index] = this.dragging.item;
    }

    this.dragging = undefined;
  }

  private updateMouseAddTooltip(): void {
    if (this.tooltip) {
      return;
    }

    const filter: ObjectFilter = {
      typeMatch: [InventorySlotObject],
      boundingBox: SceneObject.calculateBoundingBox(
        Input.mouse.position.x,
        Input.mouse.position.y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      )
    }
    const slot = this.scene.getObject(filter) as InventorySlotObject;

    if (slot === undefined) {
      return;
    }

    if (slot.item === undefined) {
      return;
    }

    this.tooltip = new InventoryTooltipObject(
      this.scene,
      {
        item: slot.item,
        index: slot.index,
        width: CanvasConstants.DEVICE_TYPE === DeviceType.Desktop ? 12 : 6,
        x: slot.boundingBox.world.right,
        y: slot.boundingBox.world.bottom,
      }
    );
    this.addChild(this.tooltip);
  }

  private updateMouseRemoveTooltip(): void {
    if (this.tooltip === undefined) {
      return;
    }

    const filter: ObjectFilter = {
      typeMatch: [InventorySlotObject],
      boundingBox: SceneObject.calculateBoundingBox(
        Input.mouse.position.x,
        Input.mouse.position.y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      )
    }
    const slot = this.scene.getObject(filter) as InventorySlotObject;

    if (this.dragging || slot === undefined || slot.index !== this.tooltip.index) {
      this.removeChild(this.tooltip);
      this.tooltip = undefined;
    }
  }

  private updateClose(): void {
    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.CloseInventory)) {
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.CloseInventory);

    this.destroy();
  }

  private updateControllerGridPosition(): void {
    if (!Input.gamepad.connected) {
      return;
    }

    if (!Input.isPressed<Control>(CONTROL_SCHEME, [Control.Up, Control.Down, Control.Left, Control.Right])) {
      return;
    }

    if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Up)) {
      if (this.gridPosition.y > 0) {
        this.gridPosition.y--;
      }
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Right)) {
      if (this.gridPosition.x < this.grid.rows - 1) {
        this.gridPosition.x++;
      }
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Down)) {
      if (this.gridPosition.y < this.grid.columns - 1) {
        this.gridPosition.y++;
      }
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Left)) {
      if (this.gridPosition.x > 0) {
        this.gridPosition.x--;
      }
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, [Control.Up, Control.Down, Control.Left, Control.Right]);
  }

  private updateControllerQuickMove(): void {
    if (!Input.gamepad.connected) {
      return;
    }

    const key = GamepadKey.ButtonTop;

    if (!Input.isButtonPressed(key)) {
      return;
    }

    Input.clearButtonPressed(key);

    const filter: ObjectFilter = {
      typeMatch: [InventorySlotObject],
      boundingBox: SceneObject.calculateBoundingBox(
        this.controllerSelectorPosition.x,
        this.controllerSelectorPosition.y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      )
    }
    const slot = this.scene.getObject(filter);

    if (slot === undefined) {
      return;
    }

    this.quickMove(
      'inventory', // TODO: source of inventory shouldn't be hard coded
      (slot as InventorySlotObject).index
    );
  }

  private updateControllerStartDragging(): void {
    if (!Input.gamepad.connected) {
      return;
    }

    const key = GamepadKey.ButtonBottom;

    if (!Input.isButtonPressed(key)) {
      return;
    }

    Input.clearButtonPressed(key);

    const filter: ObjectFilter = {
      typeMatch: [InventorySlotObject],
      position: {
        x: this.controllerSelectorPosition.x + 1,
        y: this.controllerSelectorPosition.y + 1,
      }
    }
    const slot = this.scene.getObject(filter) as InventorySlotObject;

    if (slot === undefined) {
      return;
    }

    if (slot.item === undefined) {
      return;
    }

    this.startDraggingItem(
      'controller',
      'inventory', // TODO: source of inventory shouldn't be hard coded
      slot.index
    );
  }

  private updateControllerStopDragging(): void {
    if (!Input.gamepad.connected) {
      return;
    }

    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.type !== 'controller') {
      return;
    }

    if (!Input.isButtonPressed(GamepadKey.ButtonBottom)) {
      return;
    }
    Input.clearButtonPressed(GamepadKey.ButtonBottom);

    const filter: ObjectFilter = {
      boundingBox: SceneObject.calculateBoundingBox(
        this.controllerSelectorPosition.x,
        this.controllerSelectorPosition.y,
        CanvasConstants.TILE_PIXEL_SIZE,
        CanvasConstants.TILE_PIXEL_SIZE,
      ),
      typeMatch: [InventorySlotObject, InventoryButtonTrashObject]
    };

    const slot = this.scene.getObject(filter);
    if (slot === undefined) {
      this.stopDraggingItem();
    } else if (slot instanceof InventoryButtonTrashObject) {
      if (Inventory.canItemBeDestroyed(this.dragging.item.type)) {
        // destroy
        this.dragging = undefined;
      } else {
        this.stopDraggingItem();
      }
    } else if (slot instanceof InventorySlotObject) {
      // swap
      const source = this.dragging.source === 'inventory' ? this.inventory : this.otherInventory;
      const target = slot.otherInventory === undefined ? this.inventory : this.otherInventory;

      source.items[this.dragging.index] = target.items[slot.index];
      target.items[slot.index] = this.dragging.item;
    }

    this.dragging = undefined;
  }

  private renderMouseInventoryItem(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.type !== 'mouse') {
      return;
    }

    const sprite = Inventory.getItemSprite(this.dragging.item.type);

    RenderUtils.renderSprite(
      context,
      Assets.images[sprite.tileset],
      sprite.x,
      sprite.y,
      Input.mouse.position.x - 0.5,
      Input.mouse.position.y - 0.5,
    );
  }

  private renderControllerInventoryItem(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.type !== 'controller') {
      return;
    }

    const sprite = Inventory.getItemSprite(this.dragging.item.type);

    RenderUtils.renderSprite(
      context,
      Assets.images[sprite.tileset],
      sprite.x,
      sprite.y,
      this.controllerSelectorPosition.x + 0.5,
      this.controllerSelectorPosition.y + 0.5,
    );
  }

  private renderMouseInventoryItemStackSize(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.type !== 'mouse') {
      return;
    }

    this.renderInventoryItemStackSize(
      context,
      Input.mouse.position.x + 0.25,
      Input.mouse.position.y + 0.75,
    )
  }

  private renderControllerInventoryItemStackSize(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.type !== 'controller') {
      return;
    }

    this.renderInventoryItemStackSize(
      context,
      this.controllerSelectorPosition.x + 1.25,
      this.controllerSelectorPosition.y + 1.75,
    )
  }

  private renderInventoryItemStackSize(context: CanvasRenderingContext2D, x: number, y: number): void {
    if (Inventory.getItemMaxStackSize(this.dragging.item.type) === 1) {
      return;
    }

    RenderUtils.renderText(
      context,
      `${this.dragging.item.currentStackSize}`,
      x,
      y,
    );
  }

  private renderControllerInventorySelector(context: CanvasRenderingContext2D): void {
    if (!Input.gamepad.connected) {
      return;
    }

    if (this.grid === undefined) {
      return;
    }

    if (this.controllerSelectorPosition === undefined) {
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images.tileset_ui,
      9,
      9,
      this.controllerSelectorPosition.x,
      this.controllerSelectorPosition.y,
      2,
      2,
    );
  }

  startDraggingItem(type: DraggingType, source: DraggingSource, inventoryIndex: number): void {
    this.dragging = {
      type,
      item: this.getInventoryFromSource(source).items[inventoryIndex],
      index: inventoryIndex,
      source,
    }

    this.getInventoryFromSource(this.dragging.source).items[inventoryIndex] = undefined;
  }

  quickMove(source: DraggingSource, inventoryIndex: number): void {
    if (this.otherInventory === undefined) {
      return;
    }

    const sourceInventory = source === 'inventory' ? this.inventory : this.otherInventory;
    const targetInventory = source === 'inventory' ? this.otherInventory : this.inventory;

    // no slot to move to
    const index = targetInventory.getFirstSlotAvailable();
    if (index === undefined) {
      return;
    }

    targetInventory.items[index] = sourceInventory.items[inventoryIndex];
    sourceInventory.items[inventoryIndex] = undefined;
  }

  private stopDraggingItem(): void {
    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.source === 'inventory') {
      this.inventory.items[this.dragging.index] = this.dragging.item;
    } else if (this.dragging.source === 'chest') {
      this.otherInventory.items[this.dragging.index] = this.dragging.item;
    }
  }

  private getInventoryFromSource(source: DraggingSource): Inventory {
    switch (source) {
      case 'chest':
        return this.otherInventory;
      case 'inventory':
      default: ''
        return this.inventory;
    }
  }
}

