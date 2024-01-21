import { SceneObject, type SceneObjectBaseConfig } from '@model/scene-object';
import { type SAMPLE_SCENE_1 } from '@scenes/1.scene';
import { ChickenObject } from './chicken.object';
import { EggObject } from './egg.object';

export enum InventoryItemType {
  Chicken = 'ChickenObject',
  Egg = 'EggObject'
}

const TYPE_TO_MAX_STACK_MAP: Record<string, number | undefined> = {
  [InventoryItemType.Chicken]: 1,
  [InventoryItemType.Egg]: 9,
};

const DEFAULT_MAX_STACK = 1;

const TYPE_TO_SPRITE_MAP: Record<string, any> = {
  [InventoryItemType.Chicken]: { tileset: 'tileset_chicken', spriteX: 0, spriteY: 0, },
  [InventoryItemType.Egg]: { tileset: 'tileset_egg', spriteX: 0, spriteY: 0, },
};

const DEFAULT_SPRITE = { tileset: 'tileset_ui', spriteX: 15, spriteY: 5, };

interface Config extends SceneObjectBaseConfig {
  type: string;
  currentStackSize?: number;
}

export class InventoryItemObject extends SceneObject {
  type: string; // TODO(smg): better typing for this, but am struggling with passing around Class types
  currentStackSize: number;
  maxStackSize: number;
  sprite: { tileset: string; spriteX: number; spriteY: number; };

  constructor(protected scene: SAMPLE_SCENE_1, protected config: Config) {
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

  get objectClass(): typeof SceneObject {
    switch (this.type) {
      case InventoryItemType.Chicken:
        return ChickenObject;
      case InventoryItemType.Egg:
        return EggObject;
      default:
        return SceneObject;
    }
  }
}
