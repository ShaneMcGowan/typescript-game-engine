import { CanvasConstants } from '@core/constants/canvas.constants';
import { type SceneObjectBaseConfig, SceneObject } from '@core/model/scene-object';
import { type SCENE_GAME } from '@game/scenes/game/scene';
import { type ChestObject } from '@game/objects/chest.object';
import { type InventoryItemObject } from '@game/objects/inventory-item.object';
import { RenderUtils } from '@core/utils/render.utils';
import { Input } from '@core/utils/input.utils';
import { Assets } from '@core/utils/assets.utils';
import { InventorySlotObject } from './inventory-slot.object';
import { ObjectFilter } from '@core/model/scene';

enum Controls {
  Close = 'tab',
}

interface Config extends SceneObjectBaseConfig {
  chest?: ChestObject
}

export class InventoryObject extends SceneObject {
  private chest: ChestObject | undefined = undefined;
  itemDraggingIndex: number | undefined;

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
  }

  onUpdate(delta: number): void {
    this.updateDragging();
    this.updateClose();
  }

  onRender(context: CanvasRenderingContext2D): void {
    this.renderInventoryItemGrabbed(context);
  }

  onDestroy(): void {
    this.scene.globals.disable_player_inputs = false;
    if (this.chest) {
      this.chest.actionClose();
    }
  }

  get inventory(): InventoryItemObject[] {
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

    const item = this.scene.getObject(filter)

    alert(item);
    // this.scene.hasCollisionAtPosition()
    // this.stopDraggingItem();
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
    if (this.itemDraggingIndex === undefined) {
      return;
    }

    const item = this.inventory[this.itemDraggingIndex];

    this.renderInventoryItem(
      context,
      item.sprite.tileset,
      item.currentStackSize,
      item.maxStackSize,
      item.sprite.spriteX,
      item.sprite.spriteY,
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

  startDraggingItem(inventoryIndex: number): void {
    this.itemDraggingIndex = inventoryIndex;
  }

  stopDraggingItem(inventoryIndex: number): void {
    if(this.itemDraggingIndex === undefined){
      return;
    }

  }
}
