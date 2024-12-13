import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChestObject } from '@game/objects/chest.object';
import { RenderUtils } from '@core/utils/render.utils';
import { Input } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { InventorySlotObject } from './inventory-slot.object';
import { ObjectFilter } from '@core/model/scene';
import { FillObject } from '@core/objects/fill.object';
import { InventoryButtonCloseObject } from './inventory-button-close.object';
import { Item } from '@game/models/inventory.model';


type DraggingSource = 'inventory' | 'chest';

enum Controls {
  Close = 'tab',
}

interface Config extends SceneObjectBaseConfig {
  chest?: ChestObject
}

export class InventoryObject extends SceneObject {
  private chest: ChestObject | undefined = undefined;

  dragging: {
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

    this.scene.globals.disable_player_inputs = true;
    this.chest = config.chest;
  }

  onAwake(): void {
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

    for(let row = 0; row < rows; row++){
      for(let column = 0; column < columns; column++){
        const index = (row * columns) + column;

        slots.push(
          new InventorySlotObject(this.scene, { 
            positionX: marginLeft + (column * width), 
            positionY: marginTopInventory + (row * height), 
            index: index
          })
        );
      }
    }

    for(let row = 0; row < rowsChest; row++){
      for(let column = 0; column < columnsChest; column++){
        const index = (row * columnsChest) + column;

        if(this.chest){
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
      positionX: 30, 
      positionY: 2 
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
    this.updateDragging();
    this.updateClose();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderInventoryItem(context);
    this.renderInventoryItemStackSize(context);
  }

  onDestroy(): void {
    this.stopDraggingItem();
    this.scene.globals.disable_player_inputs = false;
    if (this.chest) {
      this.chest.actionClose();
    }
  }

  get inventory(): Item[] {
    return this.scene.globals.inventory.items;
  }

  private updateDragging(): void {
    if (this.dragging === undefined) {
      return;
    }

    if (Input.mouse.click.left === true) {
      return;
    }

    const filter: ObjectFilter = {
      position: {
        x: Input.mouse.position.x,
        y: Input.mouse.position.y
      },
      typeMatch: [InventorySlotObject]
    };

    const slot = this.scene.getObject(filter) as InventorySlotObject;
    if(slot) {
      // swap
      const source = this.dragging.source === 'inventory' ? this.inventory : this.chest.inventory;
      const target = slot.chest === undefined ? this.inventory : this.chest.inventory;
      
      source[this.dragging.index] = target[slot.index];
      target[slot.index] = this.dragging.item;
    } else {
      // don't swap
      this.stopDraggingItem();
    }

    this.dragging = undefined;
  }

  private updateClose(): void {
    if (!Input.isKeyPressed(Controls.Close)) {
      return;
    }

    Input.clearKeyPressed(Controls.Close);

    this.destroy();
  }

  private renderInventoryItem(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
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

  private renderInventoryItemStackSize(context: CanvasRenderingContext2D): void {
    if (this.dragging === undefined) {
      return;
    }

    if (this.dragging.item.maxStackSize === 1) {
      return;
    }

    RenderUtils.renderText(
      context,
      `${this.dragging.item.currentStackSize}`,
      Input.mouse.position.x + 0.25,
      Input.mouse.position.y + 0.75,
    );
  }

  startDraggingItem(source: DraggingSource, inventoryIndex: number): void {
    this.dragging = {
      item: this.getInventoryFromSource(source)[inventoryIndex],
      index: inventoryIndex,
      source: source,
    }

    this.getInventoryFromSource(this.dragging.source)[inventoryIndex] = undefined;
  }

  quickMove(source: DraggingSource, inventoryIndex: number): void {
    const target: DraggingSource = source !== 'chest' ? 'chest' : 'inventory';

    const item = this.getInventoryFromSource(source)[inventoryIndex];
    
  }

  private stopDraggingItem(): void {
    if(this.dragging === undefined){
      return;
    }

    if(this.dragging.source === 'inventory'){
      this.inventory[this.dragging.index] = this.dragging.item;
    } else if(this.dragging.source === 'chest') {
      this.chest.inventory[this.dragging.index] = this.dragging.item;
    }
  }

  private getInventoryFromSource(source: DraggingSource): Item[] {
    switch(source){
      case 'chest':
        return this.chest.inventory;
      case 'inventory':
      default: ''
        return this.inventory;
    }
  }
}

