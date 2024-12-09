import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChestObject } from '@game/objects/chest.object';
import { type InventoryItem } from '@game/objects/inventory-item.object';
import { RenderUtils } from '@core/utils/render.utils';
import { Input } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { InventorySlotObject } from './inventory-slot.object';
import { ObjectFilter } from '@core/model/scene';
import { FillObject } from '@core/objects/fill.object';
import { InventoryButtonCloseObject } from './inventory-button-close.object';

enum Controls {
  Close = 'tab',
}

interface Config extends SceneObjectBaseConfig {
  chest?: ChestObject
}

export class InventoryObject extends SceneObject {
  private chest: ChestObject | undefined = undefined;
  itemDragging: InventoryItem | undefined;
  itemDraggingIndex: number | undefined;

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
    
    const columns = 5;
    const rows = 5;

    for(let row = 0; row < rows; row++){
      for(let column = 0; column < columns; column++){
        const index = (row * columns) + column;

        slots.push(
          new InventorySlotObject(this.scene, { 
            positionX: column * 2, 
            positionY: row * 2, 
            inventoryIndex: index
          })
        );
      }
    }

    slots.forEach(slot => this.addChild(slot));

    this.addChild(new InventoryButtonCloseObject(this.scene, { positionX: 8, positionY: -2 }));
    this.addChild(new FillObject(this.scene, {
      positionX: -this.rootParent.transform.position.world.x, // offset to corner of screen
      positionY: -this.rootParent.transform.position.world.y, // offset to corner of screen
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
    this.renderInventoryItemGrabbed(context);
  }

  onDestroy(): void {
    this.stopDraggingItem();
    this.scene.globals.disable_player_inputs = false;
    if (this.chest) {
      this.chest.actionClose();
    }
  }

  get inventory(): InventoryItem[] {
    return this.scene.globals['inventory'];
  }

  private updateDragging(): void {
    if (this.itemDraggingIndex === undefined) {
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
      this.scene.globals.inventory[this.itemDraggingIndex] = this.scene.globals.inventory[slot.inventoryIndex];
      this.scene.globals.inventory[slot.inventoryIndex] = this.itemDragging;
    } else {
      // don't swap
      this.stopDraggingItem();
    }

    this.itemDragging = undefined;
    this.itemDraggingIndex = undefined;
  }

  private updateClose(): void {
    if (!Input.isKeyPressed(Controls.Close)) {
      return;
    }

    Input.clearKeyPressed(Controls.Close);

    this.destroy();
  }

  private renderInventoryItemGrabbed(context: CanvasRenderingContext2D): void {
    if (this.itemDragging === undefined) {
      return;
    }

    this.renderInventoryItem(
      context,
      this.itemDragging.sprite.tileset,
      this.itemDragging.currentStackSize,
      this.itemDragging.maxStackSize,
      this.itemDragging.sprite.spriteX,
      this.itemDragging.sprite.spriteY,
      Input.mouse.position.x - 0.5,
      Input.mouse.position.y - 0.5
    );
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
      );
    }
  }

  startDraggingItem(inventoryIndex: number): void {
    this.itemDragging = this.scene.globals.inventory[inventoryIndex];
    this.itemDraggingIndex = inventoryIndex;

    this.scene.globals.inventory[inventoryIndex] = undefined;
  }

  private stopDraggingItem(): void {
    if(this.itemDragging === undefined){
      return;
    }

    this.scene.globals.inventory[this.itemDraggingIndex] = this.itemDragging;
  }
}
