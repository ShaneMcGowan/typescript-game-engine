export enum ItemType {
  Chicken = 'Chicken',
  Egg = 'Egg',
  WheatSeeds = 'WheatSeeds',
  Wheat = 'Wheat',
  TomatoSeeds = 'TomatoSeeds',
  Tomato = 'Tomato',
  Hoe = 'Hoe',
  WateringCan = 'WateringCan',
  Chest = 'Chest',
  GateKey = 'GateKey',
  Axe = 'Axe',
  Pickaxe = 'Pickaxe',
  Rock = 'Rock',
}

/**
 * where the item can be placed
 */
export enum ItemRadius {
  Player = 'Player', // in any tile surround the player
  Anywhere = 'Anywhere', // any tile
  None = 'None' // not useable / placeable on the map
}

const DEFAULT_MAX_STACK = 1;
const DEFAULT_SPRITE = { tileset: 'tileset_ui', x: 15, y: 5, };
const DEFAULT_INVENTORY_ITEM_RADIUS: ItemRadius = ItemRadius.None;

export const TYPE_TO_RADIUS_MAP: Record<ItemType, ItemRadius> = {
  [ItemType.Chicken]: ItemRadius.Player,
  [ItemType.Egg]: ItemRadius.Player,
  [ItemType.WheatSeeds]: ItemRadius.Player,
  [ItemType.Wheat]: ItemRadius.Player,
  [ItemType.TomatoSeeds]: ItemRadius.Player,
  [ItemType.Tomato]: ItemRadius.Player,
  [ItemType.Hoe]: ItemRadius.Player,
  [ItemType.WateringCan]: ItemRadius.Player,
  [ItemType.Chest]: ItemRadius.Anywhere,
  [ItemType.GateKey]: ItemRadius.None,
  [ItemType.Axe]: ItemRadius.Player,
  [ItemType.Pickaxe]: ItemRadius.Player,
  [ItemType.Rock]: ItemRadius.None,
}

export const TYPE_TO_SPRITE_MAP: Record<ItemType, ItemSprite> = {
  [ItemType.Chicken]: { tileset: 'tileset_chicken', x: 0, y: 0, },
  [ItemType.Egg]: { tileset: 'tileset_egg', x: 0, y: 0, },
  [ItemType.WheatSeeds]: { tileset: 'tileset_plants', x: 0, y: 0, },
  [ItemType.Wheat]: { tileset: 'tileset_plants', x: 5, y: 0, },
  [ItemType.TomatoSeeds]: { tileset: 'tileset_plants', x: 0, y: 1, },
  [ItemType.Tomato]: { tileset: 'tileset_plants', x: 5, y: 1, },
  [ItemType.Hoe]: { tileset: 'tileset_tools', x: 4, y: 4, },
  [ItemType.WateringCan]: { tileset: 'tileset_tools', x: 0, y: 0, },
  [ItemType.Chest]: { tileset: 'tileset_chest', x: 1, y: 1, },
  [ItemType.GateKey]: { tileset: 'tileset_shop_key', x: 0, y: 0, },
  [ItemType.Axe]: { tileset: 'tileset_tools', x: 4, y: 2, },
  [ItemType.Pickaxe]: { tileset: 'tileset_tools', x: 4, y: 4, },
  [ItemType.Rock]: { tileset: 'tileset_grass_biome', x: 7, y: 1, },
};

export const TYPE_TO_MAX_STACK_MAP: Record<ItemType, number | undefined> = {
  [ItemType.Chicken]: 1,
  [ItemType.Egg]: 9,
  [ItemType.WheatSeeds]: 9,
  [ItemType.Wheat]: 9,
  [ItemType.TomatoSeeds]: 9,
  [ItemType.Tomato]: 9,
  [ItemType.Hoe]: 1,
  [ItemType.WateringCan]: 1,
  [ItemType.Chest]: 1,
  [ItemType.GateKey]: 1,
  [ItemType.Axe]: 1,
  [ItemType.Pickaxe]: 1,
  [ItemType.Rock]: 99,
};

export const TYPE_TO_SELL_VALUE_MAP: Record<ItemType, number> = {
  [ItemType.Chicken]: 0,
  [ItemType.Egg]: 0,
  [ItemType.WheatSeeds]: 5,
  [ItemType.Wheat]: 10,
  [ItemType.TomatoSeeds]: 5,
  [ItemType.Tomato]: 10,
  [ItemType.Hoe]: 0,
  [ItemType.WateringCan]: 0,
  [ItemType.Chest]: 0,
  [ItemType.GateKey]: 0,
  [ItemType.Axe]: 0,
  [ItemType.Pickaxe]: 0,
  [ItemType.Rock]: 1,
}

export const TYPE_TO_NAME_MAP: Record<ItemType, string> = {
  [ItemType.Chicken]: 'Chicken',
  [ItemType.Egg]: 'Egg',
  [ItemType.WheatSeeds]: 'Wheat Seeds',
  [ItemType.Wheat]: 'Wheat',
  [ItemType.TomatoSeeds]: 'Tomato Seeds',
  [ItemType.Tomato]: 'Tomato',
  [ItemType.Hoe]: 'Hoe',
  [ItemType.WateringCan]: 'Watering Can',
  [ItemType.Chest]: 'Chest',
  [ItemType.GateKey]: 'Shop Key',
  [ItemType.Axe]: 'Axe',
  [ItemType.Pickaxe]: 'Pickaxe',
  [ItemType.Rock]: 'Rock',
}

export const TYPE_TO_DESCRIPTION_MAP: Record<ItemType, string> = {
  [ItemType.Chicken]: 'The thing that comes out of an Egg.',
  [ItemType.Egg]: 'The thing that comes out of a Chicken.',
  [ItemType.WheatSeeds]: 'If I plant these they will grow into Wheat.',
  [ItemType.Wheat]: 'Wheat, can be made into things like bread (not in this game though, sorry pal).',
  [ItemType.TomatoSeeds]: 'If I plant these they will grow into a Tomato.',
  [ItemType.Tomato]: 'Like an Orange but red (trust me on this one).',
  [ItemType.Hoe]: `A long-handled gardening tool with a thin metal blade. I can use this to prepare the ground for planting seeds. Some bearded guy in a red jacket is always raving on about these.`,
  [ItemType.WateringCan]: 'I can use this to water dirt.',
  [ItemType.Chest]: 'I can put my treasures in here, or maybe just my socks or something.',
  [ItemType.GateKey]: `A key for a Gate, it's old and rusty looking. It tastes kinda funny too.`,
  [ItemType.Axe]: `A tool with a sharp blade, I can use this to chop down trees.`,
  [ItemType.Pickaxe]: `A tool with a strong blunt head, I can use this to break rocks.`,
  [ItemType.Rock]: `A rock that was broken from an even larger rock, I can use this to make stone tools.`,
}

export const TYPE_TO_CAN_DESTROY_MAP: Record<ItemType, boolean> = {
  [ItemType.Chicken]: true,
  [ItemType.Egg]: true,
  [ItemType.WheatSeeds]: true,
  [ItemType.Wheat]: true,
  [ItemType.TomatoSeeds]: true,
  [ItemType.Tomato]: true,
  [ItemType.Hoe]: true,
  [ItemType.WateringCan]: true,
  [ItemType.Chest]: true,
  [ItemType.GateKey]: false,
  [ItemType.Axe]: true,
  [ItemType.Pickaxe]: true,
  [ItemType.Rock]: true,
}

export interface ItemSprite {
  tileset: string;
  x: number;
  y: number;
}

export interface Item {
  type: ItemType;
  currentStackSize: number;
  maxStackSize: number;
  sprite: { tileset: string; x: number; y: number; };
  radius: ItemRadius;
}

/**
 * A reusable inventory class for managing item storage with utilities
 */
export class Inventory {

  items: (Item | undefined)[] = [];
  rows: number;
  columns: number;

  constructor(rows: number, columns: number){
    this.rows = rows;
    this.columns = columns;
  }

  get size(): number {
    return this.rows * this.columns;
  }

  /**
   * finds the index of first slot with room in stack (ignoring empty slots), otherwise returns undefined
   * @param type 
   * @returns 
   */

  firstSlotWithRoom(type: ItemType): number | undefined {
    for (let i = 0; i < this.size; i++) {
      const item = this.items[i];
      
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
   * finds the index of the first free slot, if none available, returns undefined
   * @returns 
   */
   getFirstFreeSlot(): number | undefined {
    for (let i = 0; i < this.size; i++) {
      if(this.items[i] === undefined){
        return i;
      }
    }

    return undefined;
  }

   /**
   * finds the index of the first slot for a given type, if none found, returns undefined
   * @returns 
   */
   getFirstIndexForType(type: ItemType): number | undefined {
    for (let i = 0; i < this.size; i++) {
      const item = this.items[i];

      if(item === undefined){
        continue;
      }
      
      if(item.type === type){
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
  addToInventory(type: ItemType): Item | undefined {

    // existing stack
    const stackIndex = this.firstSlotWithRoom(type);
    if(stackIndex !== undefined){
      const item = this.items[stackIndex];
      item.currentStackSize++;
      return item;
    }

    // blank slot
    const blankIndex = this.getFirstFreeSlot();
    if(blankIndex !== undefined){
      const item = this.createItem(type);
      this.items[blankIndex] = item;
      return item;
    }

    // no room
    return undefined;
  }

  /**
   * Removes the specified amount from item stack at given index.
   * Failing that, returns undefined.
   * @param index 
   * @returns 
   */
  removeFromInventoryByIndex(index: number, amount: number): Item | undefined {
    const item = this.items[index];
    
    if (item === undefined) {
      return;
    }

    if(item.currentStackSize < amount){
      return;
    }

    item.currentStackSize -= amount;

    if (item.currentStackSize === 0) {
      // remove empty stack
      this.items[index] = undefined;
    }

    return item;
  }

  /**
   * Returns true if the inventory contains the specificed amount and item, across multiple stacks
   * @param type 
   * @param amount 
   */
  hasItem(type: ItemType, amount: number): boolean{
    const items = this.items.filter(item => item !== undefined && item.type === type);
    const total = items.reduce((acc, curr) => acc + curr.currentStackSize, 0)

    if(total >= amount){
      return true;
    }

    return false;
  }

  /**
   * Removes items until the provided amount has been removed or we are at the end of the inventory 
   * @param type 
   * @param amount 
   */
  removeItems(type: ItemType, amount: number): boolean {
    let removed = 0;

    for(const [index, item] of this.items.entries()){
      if(item === undefined){
        continue;
      }

      if(item.type !== type){
        continue;
      }

      const yetToBeRemoved = amount - removed;
      // no more to be removed, return;
      if(yetToBeRemoved === 0){
        return true;
      }

      if(yetToBeRemoved >= item.currentStackSize){
        // amount greater than stack, remove stack
        removed += item.currentStackSize;
        item.currentStackSize = 0;
        this.items[index] = undefined;
      } else {
        // reduce stack
        removed += item.currentStackSize;
        item.currentStackSize -= amount;
      }
    }

    return false;
  }

  private createItem(type: ItemType, stackSize?: number): Item {
    const maxStackSize =  TYPE_TO_MAX_STACK_MAP[type] ?? DEFAULT_MAX_STACK;
    
    let currentStackSize = 1;
    if (stackSize !== undefined) {
      if(stackSize > maxStackSize){
        currentStackSize = maxStackSize;
      } else {
        currentStackSize = stackSize;
      }
    }
    
    return {
      type : type,
      maxStackSize : maxStackSize,
      sprite : TYPE_TO_SPRITE_MAP[type] ?? DEFAULT_SPRITE,
      radius : TYPE_TO_RADIUS_MAP[type] ?? DEFAULT_INVENTORY_ITEM_RADIUS,
      currentStackSize: currentStackSize
    }
  }

  static getItemName(item: Item): string {
    return TYPE_TO_NAME_MAP[item.type];
  }

  static getItemDescription(item: Item): string {
    return TYPE_TO_DESCRIPTION_MAP[item.type];
  }

  static canItemBeDestroyed(item: Item): boolean {
    return TYPE_TO_CAN_DESTROY_MAP[item.type];
  }
  
}
