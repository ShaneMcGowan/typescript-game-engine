import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChestObject } from '@game/objects/chest.object';
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

type DraggingSource = 'inventory' | 'chest';
type DraggingType = 'mouse' | 'controller';

interface Config extends SceneObjectBaseConfig {
  chest?: ChestObject
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
  private chest: ChestObject | undefined = undefined;
  
  private grid: Grid;
  private gridPosition: { x: number, y: number } = { x: 0, y: 0 };

  dragging: {
    type: DraggingType;
    item: Item;
    index: number;
    source: DraggingSource;
  } | undefined

  constructor(
    protected scene: SCENE_GAME,
    config: Config
  ) {
    super(scene, config);
    this.renderer.enabled = true;
    this.renderer.layer = CanvasConstants.FIRST_UI_RENDER_LAYER + 2;
    this.collision.layer = CanvasConstants.UI_COLLISION_LAYER;

    this.scene.globals.player.enabled = false;
    this.chest = config.chest;
  }

  onAwake(): void {
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
    const rows = 5;
    const columns = 5;
    const rowsChest = this.chest ? this.chest.rows : 0;
    const columnsChest = this.chest ? this.chest.columns : 0;
    // inventory slots
    const width = 2;
    const height = 2;
    const gap = (columns + 1) * width;

    const rowsTotal = rows + (this.chest ? rowsChest + 1 : 0); // 1 is a gap
    const columnsTotal = columns + (this.chest ? columnsChest + 1 : 0); // 1 is a gap

    const marginTopInventory = ((CanvasConstants.CANVAS_TILE_HEIGHT - (rows * height)) / 2) + (height / 2); // height / 2 due to objects being drawn from their center
    const marginTopChest = ((CanvasConstants.CANVAS_TILE_HEIGHT - (rowsChest * height)) / 2) + (height / 2); // height / 2 due to objects being drawn from their center

    const marginLeft = ((CanvasConstants.CANVAS_TILE_WIDTH - (columnsTotal * width)) / 2) + (width / 2); // width / 2 due to objects being drawn from their center

    // configure grid
    this.grid.rows = rows;
    this.grid.columns = columns;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        
        // initialise position array
        if(column === 0){
          this.grid.positions[row] = [];
        }

        const index = (row * columns) + column;

        const positionX = marginLeft + (column * width);
        const positionY = marginTopInventory + (row * height);

        // store position
        this.grid.positions[row][column] = { x: positionX, y: positionY };
        
        slots.push(
          new InventorySlotObject(this.scene, {
            positionX: positionX,
            positionY: positionY,
            index: index
          })
        );
      }
    }

    for (let row = 0; row < rowsChest; row++) {
      for (let column = 0; column < columnsChest; column++) {
        const index = (row * columnsChest) + column;

        if (this.chest) {
          slots.push(
            new InventorySlotObject(this.scene, {
              positionX: marginLeft + gap + (column * width),
              positionY: marginTopChest + (row * height),
              index: index,
              chest: this.chest
            })
          );
        }
      }
    }

    slots.forEach(slot => this.addChild(slot));

    this.addChild(new InventoryButtonCloseObject(this.scene, {
      positionX: 29,
      positionY: 1
    }));

    this.addChild(new InventoryButtonTrashObject(this.scene, {
      positionX: 27,
      positionY: 1
    }));

    this.addChild(new FillObject(this.scene, {
      positionX: 0,
      positionY: 0,
      hexColourCode: '#00000099',
      width: CanvasConstants.CANVAS_TILE_WIDTH,
      height: CanvasConstants.CANVAS_TILE_HEIGHT
    }));
  }

  onUpdate(delta: number): void {
    this.updateDraggingMouse();
    this.updateClose();
    this.updateControllerGridPosition();
    this.updateControllerQuickMove();
    this.updateControllerStopDragging();
    this.updateControllerStartDragging();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderMouseInventoryItem(context);
    this.renderMouseInventoryItemStackSize(context);
    
    this.renderControllerInventoryItem(context);
    this.renderControllerInventoryItemStackSize(context);
    this.renderControllerInventorySelector(context);

    this.renderTooltip(context);
  }

  onDestroy(): void {
    this.stopDraggingItem();
    this.scene.globals.player.enabled = true;
    if (this.chest) {
      this.chest.actionClose();
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

  private updateDraggingMouse(): void {
    if (this.dragging === undefined) {
      return;
    }

    if(this.dragging.type !== 'mouse'){
      return;
    }

    if (Input.isMousePressed(MouseKey.Left)) {
      return;
    }

    const filter: ObjectFilter = {
      position: {
        x: Input.mouse.position.x,
        y: Input.mouse.position.y
      },
      typeMatch: [InventorySlotObject, InventoryButtonTrashObject]
    };

    const slot = this.scene.getObject(filter);
    if (slot === undefined) {
      this.stopDraggingItem();
    } else if (slot instanceof InventoryButtonTrashObject) {
      // destroy
      this.dragging = undefined;
    } else if (slot instanceof InventorySlotObject) {
      // swap
      const source = this.dragging.source === 'inventory' ? this.inventory : this.chest.inventory;
      const target = slot.chest === undefined ? this.inventory : this.chest.inventory;

      source.items[this.dragging.index] = target.items[slot.index];
      target.items[slot.index] = this.dragging.item;
    }

    this.dragging = undefined;
  }

  private updateClose(): void {
    if (!Input.isPressed<Control>(CONTROL_SCHEME, Control.CloseInventory)) {
      return;
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, Control.CloseInventory);
    
    this.destroy();
  }

  private updateControllerGridPosition(): void {
    if (!Input.isPressed<Control>(CONTROL_SCHEME, [Control.Up, Control.Down, Control.Left, Control.Right])) {
      return;
    }

    if(Input.isPressed<Control>(CONTROL_SCHEME, Control.Up)){
      if(this.gridPosition.y > 0){
        this.gridPosition.y--;
      }
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Right)){
      if(this.gridPosition.x < this.grid.rows - 1){
        this.gridPosition.x++;
      }
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Down)) {
      if(this.gridPosition.y < this.grid.columns - 1){
        this.gridPosition.y++;
      }
    } else if (Input.isPressed<Control>(CONTROL_SCHEME, Control.Left)){
      if(this.gridPosition.x > 0){
        this.gridPosition.x--;
      }
    }

    Input.clearPressed<Control>(CONTROL_SCHEME, [Control.Up, Control.Down, Control.Left, Control.Right]);
  }

  private updateControllerQuickMove(): void {
    if(!Input.gamepad.connected){
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
        2,
        2,
      )
    }
    const slot = this.scene.getObject(filter);
    
    if(slot === undefined){
      return;
    }

    this.quickMove(
      'inventory', // TODO: source of inventory shouldn't be hard coded
      (slot as InventorySlotObject).index
    );
  }

  private updateControllerStartDragging(): void {
    if(!Input.gamepad.connected){
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
    
    if(slot === undefined){
      return;
    }

    if(slot.item === undefined){
      return;
    }

    this.startDraggingItem(
      'controller',
      'inventory', // TODO: source of inventory shouldn't be hard coded
      slot.index
    );
  }

  private updateControllerStopDragging(): void {
    if (this.dragging === undefined) {
      return;
    }

    if(this.dragging.type !== 'controller'){
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
        2,
        2,
      ),
      typeMatch: [InventorySlotObject, InventoryButtonTrashObject]
    };

    const slot = this.scene.getObject(filter);
    if (slot === undefined) {
      this.stopDraggingItem();
    } else if (slot instanceof InventoryButtonTrashObject) {
      // destroy
      this.dragging = undefined;
    } else if (slot instanceof InventorySlotObject) {
      // swap
      const source = this.dragging.source === 'inventory' ? this.inventory : this.chest.inventory;
      const target = slot.chest === undefined ? this.inventory : this.chest.inventory;

      source.items[this.dragging.index] = target.items[slot.index];
      target.items[slot.index] = this.dragging.item;
    }

    this.dragging = undefined;
  }

  private renderMouseInventoryItem(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
      return;
    }

    if(this.dragging.type !== 'mouse'){
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[this.dragging.item.sprite.tileset],
      this.dragging.item.sprite.spriteX,
      this.dragging.item.sprite.spriteY,
      Input.mouse.position.x - 0.5,
      Input.mouse.position.y - 0.5,
    );
  }

  private renderControllerInventoryItem(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
      return;
    }

    if(this.dragging.type !== 'controller'){
      return;
    }

    RenderUtils.renderSprite(
      context,
      Assets.images[this.dragging.item.sprite.tileset],
      this.dragging.item.sprite.spriteX,
      this.dragging.item.sprite.spriteY,
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
    if (this.dragging.item.maxStackSize === 1) {
      return;
    }

    RenderUtils.renderText(
      context,
      `${this.dragging.item.currentStackSize}`,
      x,
      y,
    );
  }

  private renderTooltip(context: CanvasRenderingContext2D): void {
    if (this.isDragging) {
      return;
    }

    const filter: ObjectFilter = {
      position: {
        x: Input.mouse.position.x,
        y: Input.mouse.position.y
      },
      typeMatch: [InventorySlotObject]
    };
    const slot = (this.scene.getObject(filter) as InventorySlotObject);

    if (slot === undefined) {
      return;
    }

    if (slot.item === undefined) {
      return;
    }

    RenderUtils.fillRectangle(
      context,
      Input.mouse.position.x + 0.5,
      Input.mouse.position.y + 0.25,
      20,
      5,
      {
        type: 'tile',
        colour: '#ffffffcc'
      }
    );

    RenderUtils.renderText(
      context,
      `${Inventory.getItemName(slot.item)}`,
      Input.mouse.position.x + 1,
      Input.mouse.position.y + 1
    );

    const description = Inventory.getItemDescription(slot.item);
    description.split('\n').forEach((line, index) => {
      RenderUtils.renderText(
        context,
        `${line}`,
        Input.mouse.position.x + 1,
        Input.mouse.position.y + 2 + (index * 0.75)
      );
    });
  }

  private renderControllerInventorySelector(context: CanvasRenderingContext2D): void {
    if(!Input.gamepad.connected){
      return;
    }

    if(this.grid === undefined){
      return;
    }

    if(this.controllerSelectorPosition === undefined){
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
    if (this.chest === undefined) {
      return;
    }

    const sourceInventory = source === 'inventory' ? this.inventory : this.chest.inventory;
    const targetInventory = source === 'inventory' ? this.chest.inventory : this.inventory;

    // no slot to move to
    const index = targetInventory.getFirstFreeSlot();
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
      this.chest.inventory.items[this.dragging.index] = this.dragging.item;
    }
  }

  private getInventoryFromSource(source: DraggingSource): Inventory {
    switch (source) {
      case 'chest':
        return this.chest.inventory;
      case 'inventory':
      default: ''
        return this.inventory;
    }
  }
}

