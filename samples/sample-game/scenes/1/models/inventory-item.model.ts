import { type SceneObject } from '@core/model/scene-object';
import { ChickenObject } from '../objects/chicken.object';
import { EggObject } from '../objects/egg.object';
import { TomatoSeedsObject } from '../objects/seeds/tomato-seeds.object';
import { WheatSeedsObject } from '../objects/seeds/wheat-seeds.object';

export enum InventoryItemType {
  Chicken = 'Chicken',
  Egg = 'Egg',
  WheatSeeds = 'WheatSeeds',
  TomatoSeeds = 'TomatoSeeds'
}

export function getInventoryItemClass(type: InventoryItemType): new (...args: any[]) => SceneObject {
  switch (type) {
    case InventoryItemType.Chicken:
      return ChickenObject;
    case InventoryItemType.Egg:
      return EggObject;
    case InventoryItemType.WheatSeeds:
      return WheatSeedsObject;
    case InventoryItemType.TomatoSeeds:
      return TomatoSeedsObject;
  }
};

export function isInventoryItem(object: SceneObject): boolean {
  return object instanceof ChickenObject ||
  object instanceof EggObject ||
  object instanceof TomatoSeedsObject ||
  object instanceof WheatSeedsObject;
};

export function getInventoryItemType(object: SceneObject): InventoryItemType | undefined {
  if (object instanceof ChickenObject) {
    return InventoryItemType.Chicken;
  }
  if (object instanceof EggObject) {
    return InventoryItemType.Egg;
  }
  if (object instanceof TomatoSeedsObject) {
    return InventoryItemType.TomatoSeeds;
  }
  if (object instanceof WheatSeedsObject) {
    return InventoryItemType.WheatSeeds;
  }
  return undefined;
};
