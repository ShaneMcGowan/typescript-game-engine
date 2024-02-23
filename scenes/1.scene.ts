import { type Client } from '../client';
import { Scene, type SceneGlobalsBaseConfig } from '../core/model/scene';
import { SAMPLE_SCENE_1_MAP_0 } from './1/maps/0.map';
import { SAMPLE_SCENE_1_MAP_1 } from './1/maps/1.map';
import { InventoryItemType } from './1/models/inventory-item.model';
import { InventoryItemObject } from './1/objects/inventory-item.object';

const EVENT_TYPES: Record<string, string> = {
  TOGGLE_INVENTORY: 'TOGGLE_INVENTORY',
  INVENTORY_OPENED: 'INVENTORY_OPENED',
  INVENTORY_CLOSED: 'INVENTORY_CLOSED',
  TOGGLE_CHEST: 'TOGGLE_CHEST',
  CHEST_OPENED: 'CHEST_OPENED',
  CHEST_CLOSED: 'CHEST_CLOSED',
  DIRT_PLACED: 'DIRT_PLACED',
  DIRT_REMOVED: 'DIRT_REMOVED',
  TEXTBOX_OPENED: 'TEXTBOX_OPENED',
  TEXTBOX_CLOSED: 'TEXTBOX_CLOSED',
};

interface Globals extends SceneGlobalsBaseConfig {
  chickens_follow_player: boolean;
  inventory: InventoryItemObject[];
  inventory_size: number;
  hotbar_size: number;
  hotbar_selected_index: number;
}

export class SAMPLE_SCENE_1 extends Scene {
  globals: Globals = {
    ...this.globals,
    chickens_follow_player: false,
    inventory: [
      new InventoryItemObject(this, { type: InventoryItemType.Chicken, }),
      new InventoryItemObject(this, { type: InventoryItemType.Egg, }),
      new InventoryItemObject(this, { type: InventoryItemType.TomatoSeeds, currentStackSize: 10, }),
      new InventoryItemObject(this, { type: InventoryItemType.WheatSeeds, currentStackSize: 10, })
    ],
    inventory_size: 36,
    hotbar_size: 9,
    hotbar_selected_index: 0,
  };

  maps = [
    SAMPLE_SCENE_1_MAP_0,
    SAMPLE_SCENE_1_MAP_1
  ];

  eventTypes = EVENT_TYPES;

  constructor(client: Client) {
    super(client);
    this.changeMap(0); // should this be the default?
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
      // TODO(smg): this is techically an error state so should an error be thrown here instead of silently returning?
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
}
