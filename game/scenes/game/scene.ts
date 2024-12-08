import { type Client } from '@core/client';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { InventoryItemType } from '@game/models/inventory-item.model';
import { InventoryItem } from '@game/objects/inventory-item.object';
import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';

interface Globals extends SceneGlobalsBaseConfig {
  inventory: Array<InventoryItem | undefined>;
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
      new InventoryItem(this, { type: InventoryItemType.Hoe, }),
      new InventoryItem(this, { type: InventoryItemType.WateringCan, }),
      new InventoryItem(this, { type: InventoryItemType.WheatSeeds, currentStackSize: 5, }),
      undefined,
      undefined,

      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),

      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),

      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),

      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),
      new InventoryItem(this, { type: InventoryItemType.Chicken, }),


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

  /**
   * returns index of first slot with room in stack (ignoring empty slots)
   * @param type 
   * @returns 
   */
  inventoryFirstStackWithRoom(type: InventoryItemType): number | undefined {
    for (let i = 0; i < this.globals.inventory_size; i++) {
      const item = this.globals.inventory[i];
      
      if(item === undefined){
        continue;
      }
      
      if(item.type !== type){
        continue;
      }

      if(item.currentStackSize >= item.maxStackSize){
        continue
      }
      
      return i;
    }

    return undefined;
  }

  /**
   * returns index of first empty slot
   * @returns 
   */
  inventoryFirstFreeSlot(): number | undefined {
    for (let i = 0; i < this.globals.inventory_size; i++) {
      if(this.globals.inventory[i] === undefined){
        return i;
      }
    }

    return undefined;
  }

  /**
   * Adds an item to an existing stack if there is room, returning the stack
   * Failing that, create a new stack, returning the new stack
   * Failing that, returns undefined if item was not added to inventory
   * TODO(shane): handle passing a number also (i.e. more than one of an item)
   * @param type 
   * @returns 
   */
  addToInventory(type: InventoryItemType): InventoryItem | undefined {

    // existing stack
    const stackIndex = this.inventoryFirstStackWithRoom(type);
    if(stackIndex !== undefined){
      const item = this.globals.inventory[stackIndex];
      item.currentStackSize++;
      return item;
    }

    // blank slot
    const blankIndex = this.inventoryFirstFreeSlot();
    if(blankIndex !== undefined){
      const item = new InventoryItem(this, { type, });
      this.globals.inventory[blankIndex] = item;
      return item;
    }

    // no room
    return undefined;
  }

  inventoryHasRoom(type: InventoryItemType): boolean {
    if(this.inventoryFirstStackWithRoom(type)){
      return true;
    }

    if(this.inventoryFirstFreeSlot()){
      return true;
    }

    return false;
  }

  /**
   * Removes the specified amount from item stack at given index.
   * Failing that, returns undefined.
   * @param index 
   * @returns 
   */
  removeFromInventoryByIndex(index: number, amount: number): InventoryItem | undefined {
    const item = this.globals.inventory[index];
    
    if (item === undefined) {
      return;
    }

    if(item.currentStackSize < amount){
      return;
    }

    item.currentStackSize -= amount;

    if (item.currentStackSize === 0) {
      // remove empty stack
      this.globals.inventory[index] = undefined;
    }

    return item;
  }

  get selectedInventoryItem(): InventoryItem | undefined {
    return this.globals.inventory[this.globals.hotbar_selected_index];
  }

  get selectedInventoryIndex(): number {
    return this.globals.hotbar_selected_index;
  }

}
