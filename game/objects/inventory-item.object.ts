import { type SCENE_GAME } from '@game/scenes/game/scene';
import { InventoryItemRadius, InventoryItemType } from '@game/models/inventory-item.model';

export interface InventoryItemSprite {
  tileset: string;
  spriteX: number;
  spriteY: number;
}

const TYPE_TO_MAX_STACK_MAP: Record<InventoryItemType, number | undefined> = {
  [InventoryItemType.Chicken]: 1,
  [InventoryItemType.Egg]: 9,
  [InventoryItemType.WheatSeeds]: 9,
  [InventoryItemType.Wheat]: 9,
  [InventoryItemType.TomatoSeeds]: 9,
  [InventoryItemType.Tomato]: 9,
  [InventoryItemType.Hoe]: 1,
  [InventoryItemType.WateringCan]: 1,
  [InventoryItemType.Chest]: 1
};

const DEFAULT_MAX_STACK = 1;
const DEFAULT_SPRITE = { tileset: 'tileset_ui', spriteX: 15, spriteY: 5, };

export const TYPE_TO_SPRITE_MAP: Record<InventoryItemType, InventoryItemSprite> = {
  [InventoryItemType.Chicken]: { tileset: 'tileset_chicken', spriteX: 0, spriteY: 0, },
  [InventoryItemType.Egg]: { tileset: 'tileset_egg', spriteX: 0, spriteY: 0, },
  [InventoryItemType.WheatSeeds]: { tileset: 'tileset_plants', spriteX: 0, spriteY: 0, },
  [InventoryItemType.Wheat]: { tileset: 'tileset_plants', spriteX: 5, spriteY: 0, },
  [InventoryItemType.TomatoSeeds]: { tileset: 'tileset_plants', spriteX: 0, spriteY: 1, },
  [InventoryItemType.Tomato]: { tileset: 'tileset_plants', spriteX: 5, spriteY: 1, },
  [InventoryItemType.Hoe]: { tileset: 'tileset_tools', spriteX: 4, spriteY: 4, },
  [InventoryItemType.WateringCan]: { tileset: 'tileset_tools', spriteX: 0, spriteY: 0, },
  [InventoryItemType.Chest]: { tileset: 'tileset_chest', spriteX: 1, spriteY: 1, },
};

const DEFAULT_INVENTORY_ITEM_RADIUS: InventoryItemRadius = InventoryItemRadius.None;
const TYPE_TO_RADIUS_MAP: Record<InventoryItemType, InventoryItemRadius> = {
  [InventoryItemType.Chicken]: InventoryItemRadius.Player,
  [InventoryItemType.Egg]: InventoryItemRadius.Player,
  [InventoryItemType.WheatSeeds]: InventoryItemRadius.Player,
  [InventoryItemType.Wheat]: InventoryItemRadius.Player,
  [InventoryItemType.TomatoSeeds]: InventoryItemRadius.Player,
  [InventoryItemType.Tomato]: InventoryItemRadius.Player,
  [InventoryItemType.Hoe]: InventoryItemRadius.Player,
  [InventoryItemType.WateringCan]: InventoryItemRadius.Player,
  [InventoryItemType.Chest]: InventoryItemRadius.Anywhere
}

export const TYPE_TO_SELL_VALUE_MAP: Record<InventoryItemType, number> = {
  [InventoryItemType.Chicken]: 0,
  [InventoryItemType.Egg]: 0,
  [InventoryItemType.WheatSeeds]: 5,
  [InventoryItemType.Wheat]: 10,
  [InventoryItemType.TomatoSeeds]: 5,
  [InventoryItemType.Tomato]: 10,
  [InventoryItemType.Hoe]: 0,
  [InventoryItemType.WateringCan]: 0,
  [InventoryItemType.Chest]: 0
}

interface Config {
  type: InventoryItemType;
  currentStackSize?: number;
}

export class InventoryItemObject {
  type: InventoryItemType;
  currentStackSize: number;
  maxStackSize: number;
  sprite: { tileset: string; spriteX: number; spriteY: number; };
  radius: InventoryItemRadius;

  constructor(protected scene: SCENE_GAME, config: Config) {

    this.type = config.type;
    this.maxStackSize = TYPE_TO_MAX_STACK_MAP[this.type] ?? DEFAULT_MAX_STACK;
    this.sprite = TYPE_TO_SPRITE_MAP[this.type] ?? DEFAULT_SPRITE;
    this.radius = TYPE_TO_RADIUS_MAP[this.type] ?? DEFAULT_INVENTORY_ITEM_RADIUS;

    if (config.currentStackSize !== undefined) {
      this.currentStackSize = config.currentStackSize > this.maxStackSize ? this.maxStackSize : config.currentStackSize;
    } else {
      this.currentStackSize = 1;
    }
  }
}
