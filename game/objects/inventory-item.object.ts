import { SceneObject, type SceneObjectBaseConfig } from '@core/model/scene-object';
import { type SAMPLE_SCENE_1 } from '@game/scenes/1/scene';
import { InventoryItemType } from '@game/models/inventory-item.model';

const TYPE_TO_MAX_STACK_MAP: Record<InventoryItemType, number | undefined> = {
  [InventoryItemType.Chicken]: 1,
  [InventoryItemType.Egg]: 9,
  [InventoryItemType.WheatSeeds]: 9,
  [InventoryItemType.TomatoSeeds]: 9,
};

const DEFAULT_MAX_STACK = 1;

const TYPE_TO_SPRITE_MAP: Record<InventoryItemType, any> = {
  [InventoryItemType.Chicken]: { tileset: 'tileset_chicken', spriteX: 0, spriteY: 0, },
  [InventoryItemType.Egg]: { tileset: 'tileset_egg', spriteX: 0, spriteY: 0, },
  [InventoryItemType.WheatSeeds]: { tileset: 'tileset_plants', spriteX: 0, spriteY: 0, },
  [InventoryItemType.TomatoSeeds]: { tileset: 'tileset_plants', spriteX: 0, spriteY: 1, },
};

const DEFAULT_SPRITE = { tileset: 'tileset_ui', spriteX: 15, spriteY: 5, };

interface Config extends SceneObjectBaseConfig {
  type: InventoryItemType;
  currentStackSize?: number;
}

export class InventoryItemObject extends SceneObject {
  type: InventoryItemType;
  currentStackSize: number;
  maxStackSize: number;
  sprite: { tileset: string; spriteX: number; spriteY: number; };

  constructor(protected scene: SAMPLE_SCENE_1, config: Config) {
    super(scene, config);

    this.type = config.type;
    this.maxStackSize = TYPE_TO_MAX_STACK_MAP[this.type] ?? DEFAULT_MAX_STACK;
    this.sprite = TYPE_TO_SPRITE_MAP[this.type] ?? DEFAULT_SPRITE;

    if (config.currentStackSize !== undefined) {
      this.currentStackSize = config.currentStackSize > this.maxStackSize ? this.maxStackSize : config.currentStackSize;
    } else {
      this.currentStackSize = 1;
    }
  }
}
