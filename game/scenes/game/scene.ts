import { type Client } from '@core/client';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { InventoryItemType } from '@game/models/inventory-item.model';
import { InventoryItemObject } from '@game/objects/inventory-item.object';
import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';

interface Globals extends SceneGlobalsBaseConfig {
  inventory: InventoryItemObject[];
  inventory_size: number;
  hotbar_size: number;
  hotbar_selected_index: number;
  disable_player_inputs: boolean;
  gold: number;
}

export class SCENE_GAME extends Scene {
  globals: Globals = {
    ...this.globals,
    inventory: [
      new InventoryItemObject(this, { type: InventoryItemType.Hoe, }),
      new InventoryItemObject(this, { type: InventoryItemType.WateringCan, }),
      new InventoryItemObject(this, { type: InventoryItemType.WheatSeeds, currentStackSize: 5, }),
      undefined,
      undefined,

      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),

      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),

      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),

      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),


      // new InventoryItemObject(this, { type: InventoryItemType.Egg, }),
      // new InventoryItemObject(this, { type: InventoryItemType.Tomato, currentStackSize: 10, }),
      // new InventoryItemObject(this, { type: InventoryItemType.Wheat, currentStackSize: 10, }),
      // new InventoryItemObject(this, { type: InventoryItemType.Chest, currentStackSize: 1, }),
    ],
    inventory_size: 25,
    hotbar_size: 5,
    hotbar_selected_index: 0,
    disable_player_inputs: false,
    gold: 999,
  };

  constructor(client: Client) {
    super(client);
    this.changeMap(SCENE_GAME_MAP_WORLD);
  }

  get firstFreeInventorySpaceIndex(): number | undefined {
    for (let i = 0; i < this.globals.inventory_size; i++) {
      if (this.globals.inventory[i] === undefined) {
        return i;
      }
    }

    return undefined;
  }

  getFirstInventoryItemWithRoomInStack(type: string): InventoryItemObject | undefined {
    for (let i = 0; i < this.globals.inventory_size; i++) {
      let item = this.globals.inventory[i];
      if (item !== undefined && item.type === type && item.currentStackSize < item.maxStackSize) {
        return item;
      }
    }
  }

  addToInventory(type: InventoryItemType): void {
    // check if there is already an item of this type in the inventory with room in the stack
    let item = this.getFirstInventoryItemWithRoomInStack(type);
    if (item !== undefined) {
      item.currentStackSize++;
      return;
    }

    let index = this.firstFreeInventorySpaceIndex;
    // no free space
    if (index === undefined) {
      // TODO: this is techically an error state so should an error be thrown here instead of silently returning?
      return;
    }

    // create a new item
    let newItem = new InventoryItemObject(this, { type, });
    this.globals.inventory[index] = newItem;
  }

  removeFromInventory(index: number): void {
    let item = this.globals.inventory[index];
    if (item === undefined) {
      return;
    }

    item.currentStackSize--;

    // remove if stack is empty
    if (item.currentStackSize <= 0) {
      this.globals.inventory[index] = undefined;
    }
  }

  get selectedInventoryItem(): InventoryItemObject | undefined {
    return this.globals.inventory[this.globals.hotbar_selected_index];
  }

  get selectedInventoryIndex(): number {
    return this.globals.hotbar_selected_index;
  }

}
