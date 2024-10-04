export enum InventoryItemType {
  Chicken = 'Chicken',
  Egg = 'Egg',
  WheatSeeds = 'WheatSeeds',
  Wheat = 'Wheat',
  TomatoSeeds = 'TomatoSeeds',
  Tomato = 'Tomato',
  Hoe = 'Hoe',
  WateringCan = 'WateringCan',
  Chest = 'Chest'
}

/**
 * where the item can be placed
 */
export enum InventoryItemRadius {
  Player = 'Player', // in any tile surround the player
  Anywhere = 'Anywhere', // any tile
  None = 'None' // not useable / placeable on the map
}