import { TilesetFurniture } from '@game/constants/tilesets/furniture.tileset';

export enum ItemType {
  // tools
  Axe = 'Axe',
  Hoe = 'Hoe',
  Shovel = 'Shovel',
  WateringCan = 'WateringCan',
  Pickaxe = 'Pickaxe',

  // furniture
  FurnitureBed = 'FurnitureBed',
  FurniturePainting = 'FurniturePainting',
  FurnitureTable = 'FurnitureTable',
  // FurnitureChair = 'FurnitureChair',
  // FurnitureClock = 'FurnitureClock',
  // FurnitureRugSmall = 'FurnitureRugSmall',
  FurnitureRugLarge = 'FurnitureRugLarge',
  FurnitureLamp = 'FurnitureLamp',
  // FurniturePlant = 'FurniturePlant',

  // keys
  HouseKey = 'HouseKey',
  GateKey = 'GateKey',
  FarmersSonBedroomKey = 'FarmersSonBedroomKey',
  FarmersBedroomKey = 'FarmersBedroomKey',

  // resources
  Rock = 'Rock',
  Coal = 'Coal',
  Copper = 'Copper',
  CopperBar = 'CopperBar',
  Iron = 'Iron',
  IronBar = 'IronBar',

  // machines
  CraftingBench = 'CraftingBench',
  Sprinkler = 'Sprinkler',
  Furnace = 'Furnace',

  // food
  Bread = 'Bread',

  // other
  Chicken = 'Chicken',
  Egg = 'Egg',
  WheatSeeds = 'WheatSeeds',
  Wheat = 'Wheat',
  TomatoSeeds = 'TomatoSeeds',
  Tomato = 'Tomato',
  Chest = 'Chest',

  Log = 'Log',
  Berry = 'Berry'

}

// items
export const ItemTypeFurnitureItems: ItemType[] = [ItemType.FurnitureBed, ItemType.FurnitureTable, ItemType.FurnitureLamp];
export type ItemTypeFurnitureItem = ItemType.FurnitureBed | ItemType.FurnitureTable | ItemType.FurnitureLamp;
// floors
export const ItemTypeFurnitureFloors: ItemType[] = [ItemType.FurnitureRugLarge];
export type ItemTypeFurnitureFloor = ItemType.FurnitureRugLarge;
// walls
export const ItemTypeFurnitureWalls: ItemType[] = [ItemType.FurniturePainting];
export type ItemTypeFurnitureWall = ItemType.FurniturePainting;
// all
export const ItemTypeFurnitures: ItemType[] = [...ItemTypeFurnitureItems, ...ItemTypeFurnitureFloors, ...ItemTypeFurnitureWalls];
export type ItemTypeFurniture = ItemTypeFurnitureItem | ItemTypeFurnitureFloor | ItemTypeFurnitureWall;

// keys
export type ItemTypeKey = Extract<ItemType, ItemType.GateKey | ItemType.HouseKey | ItemType.FarmersSonBedroomKey | ItemType.FarmersBedroomKey>;
export const ItemTypeKeys: ItemTypeKey[] = [ItemType.GateKey, ItemType.HouseKey, ItemType.FarmersSonBedroomKey, ItemType.FarmersBedroomKey];

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
  // machines
  [ItemType.Sprinkler]: ItemRadius.Player,
  [ItemType.Furnace]: ItemRadius.Anywhere,
  [ItemType.CraftingBench]: ItemRadius.Anywhere,
  // food
  [ItemType.Bread]: ItemRadius.None,
  // resources
  [ItemType.Copper]: ItemRadius.None,
  [ItemType.CopperBar]: ItemRadius.None,
  [ItemType.Iron]: ItemRadius.None,
  [ItemType.IronBar]: ItemRadius.None,
  // other
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
  [ItemType.HouseKey]: ItemRadius.None,
  [ItemType.Axe]: ItemRadius.Player,
  [ItemType.Pickaxe]: ItemRadius.Player,
  [ItemType.Rock]: ItemRadius.None,
  [ItemType.Coal]: ItemRadius.None,
  [ItemType.Log]: ItemRadius.None,
  [ItemType.Berry]: ItemRadius.Player,
  [ItemType.Shovel]: ItemRadius.Player,
  [ItemType.FurnitureBed]: ItemRadius.Anywhere,
  [ItemType.FurniturePainting]: ItemRadius.Anywhere,
  [ItemType.FurnitureRugLarge]: ItemRadius.Anywhere,
  [ItemType.FurnitureTable]: ItemRadius.Anywhere,
  [ItemType.FurnitureLamp]: ItemRadius.Anywhere,
  [ItemType.FarmersSonBedroomKey]: ItemRadius.None,
  [ItemType.FarmersBedroomKey]: ItemRadius.None,
};

export const TYPE_TO_SPRITE_MAP: Record<ItemType, ItemSprite> = {
  // machines
  [ItemType.Sprinkler]: { tileset: 'tileset_machine_sprinkler', x: 0, y: 0, },
  [ItemType.Furnace]: { tileset: 'tileset_machine_furnace', x: 0, y: 0, },
  [ItemType.CraftingBench]: { tileset: 'tileset_machine_crafting_bench', x: 0, y: 0, },
  // food
  [ItemType.Bread]: { tileset: 'tileset_bread', x: 0, y: 0, },
  // resources
  [ItemType.Copper]: { tileset: 'tileset_resource_copper', x: 0, y: 0, },
  [ItemType.CopperBar]: { tileset: 'tileset_resource_copper_bar', x: 0, y: 0, },
  [ItemType.Iron]: { tileset: 'tileset_resource_iron', x: 0, y: 0, },
  [ItemType.IronBar]: { tileset: 'tileset_resource_iron_bar', x: 0, y: 0, },
  // other
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
  [ItemType.Pickaxe]: { tileset: 'tileset_tool_pickaxe', x: 0, y: 0, },
  [ItemType.Rock]: { tileset: 'tileset_rocks_rock', x: 0, y: 0, },
  [ItemType.Coal]: { tileset: 'tileset_rocks_coal', x: 0, y: 0, },
  [ItemType.Log]: { tileset: 'tileset_grass_biome', x: 5, y: 2, },
  [ItemType.Berry]: { tileset: 'tileset_grass_biome', x: 1, y: 2, },
  [ItemType.Shovel]: { tileset: 'tileset_tool_shovel', x: 0, y: 0, },
  [ItemType.FurnitureBed]: { tileset: TilesetFurniture.id, x: TilesetFurniture.Bed.Blue.Default.x, y: TilesetFurniture.Bed.Blue.Default.y, },
  [ItemType.FurniturePainting]: { tileset: TilesetFurniture.id, x: TilesetFurniture.Painting.Flowers.Default.x, y: TilesetFurniture.Painting.Flowers.Default.y, },
  [ItemType.FurnitureRugLarge]: { tileset: TilesetFurniture.id, x: TilesetFurniture.Rug.Blue.Large.x, y: TilesetFurniture.Rug.Blue.Large.y, },
  [ItemType.FurnitureTable]: { tileset: TilesetFurniture.id, x: TilesetFurniture.Table.Default.Default.x, y: TilesetFurniture.Table.Default.Default.y, },
  [ItemType.FurnitureLamp]: { tileset: TilesetFurniture.id, x: TilesetFurniture.Lamp.Blue.Default.x, y: TilesetFurniture.Lamp.Blue.Default.y, },
  [ItemType.HouseKey]: { tileset: 'tileset_shop_key', x: 0, y: 0, },
  [ItemType.FarmersSonBedroomKey]: { tileset: 'tileset_shop_key', x: 0, y: 0, },
  [ItemType.FarmersBedroomKey]: { tileset: 'tileset_shop_key', x: 0, y: 0, },
};

export const TYPE_TO_MAX_STACK_MAP: Record<ItemType, number | undefined> = {
  // machines
  [ItemType.Sprinkler]: 1,
  [ItemType.Furnace]: 1,
  [ItemType.CraftingBench]: 1,
  // food
  [ItemType.Bread]: 9,
  // resources
  [ItemType.Copper]: 9,
  [ItemType.CopperBar]: 9,
  [ItemType.Iron]: 9,
  [ItemType.IronBar]: 9,
  // other
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
  [ItemType.HouseKey]: 1,
  [ItemType.Axe]: 1,
  [ItemType.Pickaxe]: 1,
  [ItemType.Rock]: 9,
  [ItemType.Coal]: 9,
  [ItemType.Log]: 9,
  [ItemType.Berry]: 9,
  [ItemType.Shovel]: 1,
  [ItemType.FurnitureBed]: 1,
  [ItemType.FurniturePainting]: 1,
  [ItemType.FurnitureRugLarge]: 1,
  [ItemType.FurnitureTable]: 1,
  [ItemType.FurnitureLamp]: 1,
  [ItemType.FarmersSonBedroomKey]: 1,
  [ItemType.FarmersBedroomKey]: 1,
};

export const TYPE_TO_BUY_VALUE_MAP: Record<ItemType, number> = {
  // tools
  [ItemType.Axe]: 50,
  [ItemType.Hoe]: 50,
  [ItemType.Shovel]: 50,
  [ItemType.WateringCan]: 50,
  [ItemType.Pickaxe]: 50,

  // furniture
  [ItemType.FurnitureBed]: 100,
  [ItemType.FurniturePainting]: 50,
  [ItemType.FurnitureRugLarge]: 30,
  [ItemType.FurnitureTable]: 40,
  [ItemType.FurnitureLamp]: 20,

  // keys
  [ItemType.GateKey]: 0,
  [ItemType.HouseKey]: 0,
  [ItemType.FarmersSonBedroomKey]: 0,
  [ItemType.FarmersBedroomKey]: 0,

  // resources
  [ItemType.Rock]: 999,
  [ItemType.Coal]: 999,
  [ItemType.Copper]: 999,
  [ItemType.CopperBar]: 999,
  [ItemType.Iron]: 999,
  [ItemType.IronBar]: 999,

  // machines
  [ItemType.Sprinkler]: 1,
  [ItemType.Furnace]: 1,
  [ItemType.CraftingBench]: 1,

  // food
  [ItemType.Bread]: 999,

  // other
  [ItemType.Chicken]: 0,
  [ItemType.Egg]: 0,
  [ItemType.WheatSeeds]: 5,
  [ItemType.Wheat]: 10,
  [ItemType.TomatoSeeds]: 5,
  [ItemType.Tomato]: 10,
  [ItemType.Chest]: 150,
  [ItemType.Log]: 1,
  [ItemType.Berry]: 5,
};

export const TYPE_TO_SELL_VALUE_MAP: Record<ItemType, number> = {
  // tools
  [ItemType.Axe]: 5,
  [ItemType.Hoe]: 5,
  [ItemType.Shovel]: 5,
  [ItemType.WateringCan]: 5,
  [ItemType.Pickaxe]: 5,

  // furniture
  [ItemType.FurnitureBed]: 5,
  [ItemType.FurniturePainting]: 5,
  [ItemType.FurnitureRugLarge]: 5,
  [ItemType.FurnitureTable]: 5,
  [ItemType.FurnitureLamp]: 5,

  // keys
  [ItemType.GateKey]: 0,
  [ItemType.HouseKey]: 0,
  [ItemType.FarmersSonBedroomKey]: 0,
  [ItemType.FarmersBedroomKey]: 0,

  // resources
  [ItemType.Rock]: 1,
  [ItemType.Coal]: 5,
  [ItemType.Copper]: 10,
  [ItemType.CopperBar]: 25,
  [ItemType.Iron]: 10,
  [ItemType.IronBar]: 25,

  // machines
  [ItemType.Sprinkler]: 1,
  [ItemType.Furnace]: 1,
  [ItemType.CraftingBench]: 1,

  // food
  [ItemType.Bread]: 25,

  // other
  [ItemType.Chicken]: 0,
  [ItemType.Egg]: 0,
  [ItemType.WheatSeeds]: 5,
  [ItemType.Wheat]: 10,
  [ItemType.TomatoSeeds]: 5,
  [ItemType.Tomato]: 10,
  [ItemType.Chest]: 30,
  [ItemType.Log]: 1,
  [ItemType.Berry]: 5,
};

export const TYPE_TO_NAME_SINGULAR_MAP: Record<ItemType, string> = {
  // keys
  [ItemType.GateKey]: 'Gate Key',
  [ItemType.HouseKey]: 'House Key',
  [ItemType.FarmersSonBedroomKey]: `Farmer's Son's Bedroom Key`,
  [ItemType.FarmersBedroomKey]: `Farmer's Bedroom Key`,

  // resources
  [ItemType.Rock]: 'Rock',
  [ItemType.Coal]: 'Coal',
  [ItemType.Copper]: 'Copper',
  [ItemType.CopperBar]: 'Copper Bar',
  [ItemType.Iron]: 'Iron',
  [ItemType.IronBar]: 'Iron Bar',

  // machines
  [ItemType.Sprinkler]: 'Sprinkler',
  [ItemType.Furnace]: 'Furnace',
  [ItemType.CraftingBench]: 'Crafting Bench',

  // food
  [ItemType.Bread]: 'Bread',

  // other
  [ItemType.Chicken]: 'Chicken',
  [ItemType.Egg]: 'Egg',
  [ItemType.WheatSeeds]: 'Wheat Seeds',
  [ItemType.Wheat]: 'Wheat',
  [ItemType.TomatoSeeds]: 'Tomato Seeds',
  [ItemType.Tomato]: 'Tomato',
  [ItemType.Hoe]: 'Hoe',
  [ItemType.WateringCan]: 'Watering Can',
  [ItemType.Chest]: 'Chest',
  [ItemType.Axe]: 'Axe',
  [ItemType.Pickaxe]: 'Pickaxe',
  [ItemType.Log]: 'Log',
  [ItemType.Berry]: 'Berry',
  [ItemType.Shovel]: 'Shovel',
  [ItemType.FurnitureBed]: 'Bed',
  [ItemType.FurniturePainting]: 'Painting',
  [ItemType.FurnitureRugLarge]: 'Large Rug',
  [ItemType.FurnitureTable]: 'Table',
  [ItemType.FurnitureLamp]: 'Lamp',
};

export const TYPE_TO_NAME_PLURAL_MAP: Record<ItemType, string> = {
  // keys
  [ItemType.GateKey]: 'Gate Keys',
  [ItemType.HouseKey]: 'House Keys',
  [ItemType.FarmersSonBedroomKey]: `Farmer's Son's Bedroom Keys`,
  [ItemType.FarmersBedroomKey]: `Farmer's Son's Bedroom Keys`,

  // resources
  [ItemType.Rock]: 'Rocks',
  [ItemType.Coal]: 'Coal',
  [ItemType.Copper]: 'Copper',
  [ItemType.CopperBar]: 'Copper Bars',
  [ItemType.Iron]: 'Iron',
  [ItemType.IronBar]: 'Iron Bars',

  // machines
  [ItemType.Sprinkler]: 'Sprinklers',
  [ItemType.Furnace]: 'Furnaces',
  [ItemType.CraftingBench]: 'Crafting Benchs',

  // food
  [ItemType.Bread]: 'Bread',

  //
  [ItemType.Chicken]: 'Chickens',
  [ItemType.Egg]: 'Eggs',
  [ItemType.WheatSeeds]: 'Wheat Seeds',
  [ItemType.Wheat]: 'Wheat',
  [ItemType.TomatoSeeds]: 'Tomato Seeds',
  [ItemType.Tomato]: 'Tomatos',
  [ItemType.Hoe]: 'Hoes',
  [ItemType.WateringCan]: 'Watering Cans',
  [ItemType.Chest]: 'Chests',
  [ItemType.Axe]: 'Axes',
  [ItemType.Pickaxe]: 'Pickaxes',
  [ItemType.Log]: 'Logs',
  [ItemType.Berry]: 'Berries',
  [ItemType.Shovel]: 'Shovels',
  [ItemType.FurnitureBed]: 'Beds',
  [ItemType.FurniturePainting]: 'Paintings',
  [ItemType.FurnitureRugLarge]: 'Large Rugs',
  [ItemType.FurnitureTable]: 'Tables',
  [ItemType.FurnitureLamp]: 'Lamps',
};

export const TYPE_TO_DESCRIPTION_MAP: Record<ItemType, string> = {
  // keys
  [ItemType.GateKey]: `A key for a Gate, it's old and rusty looking. It tastes kinda funny too.`,
  [ItemType.HouseKey]: 'A key for the House at the farm. This is the key to my future.',
  [ItemType.FarmersSonBedroomKey]: `A key to the Farmer's Son's bedroom.`,
  [ItemType.FarmersBedroomKey]: `A key to the Farmer's bedroom.`,

  // resources
  [ItemType.Rock]: 'A rock that was broken from an even larger rock, I can use this to make things.',
  [ItemType.Coal]: 'A lump of coal, can be used as fuel for a furnace.',
  [ItemType.Copper]: 'A piece of Copper, can be melted down to be used to make things.',
  [ItemType.CopperBar]: 'A bar of Copper, can be used to make tools and machines.',
  [ItemType.Iron]: 'A piece of Iron, can be melted down to be used to make things.',
  [ItemType.IronBar]: 'A bar of Iron, can be used to make tools and machines.',

  // machines
  [ItemType.Sprinkler]: 'Automagically waters surrounding crops.',
  [ItemType.Furnace]: 'Used for melting and smelting',
  [ItemType.CraftingBench]: 'Used to craft basic tools and machines',

  // food
  [ItemType.Bread]: 'A tasty piece of bread. Yum.',

  //
  [ItemType.Chicken]: 'The thing that comes out of an Egg.',
  [ItemType.Egg]: 'The thing that comes out of a Chicken.',
  [ItemType.WheatSeeds]: 'If I plant these they will grow into Wheat.',
  [ItemType.Wheat]: 'Wheat, can be made into things like bread (not in this game though, sorry pal).',
  [ItemType.TomatoSeeds]: 'If I plant these they will grow into a Tomato.',
  [ItemType.Tomato]: 'Like an Orange but red (trust me on this one).',
  [ItemType.Hoe]: 'A long-handled gardening tool with a thin metal blade. I can use this to prepare the ground for planting seeds. Some bearded guy in a red jacket is always raving on about these.',
  [ItemType.WateringCan]: 'I can use this to water dirt.',
  [ItemType.Chest]: 'I can put my treasures in here, or maybe just my socks or something.',
  [ItemType.Axe]: 'A tool with a sharp blade. I can use this to chop down trees.',
  [ItemType.Pickaxe]: 'A tool with a pointed blunt head. I can use this to break rocks.',
  [ItemType.Log]: 'A log that was cut from a mighty tree, I can use this to make things.',
  [ItemType.Berry]: 'A declious berry. If I plant it a berry tree will grow.',
  [ItemType.Shovel]: 'A tool with a blunt head. I can use this to dig holes.',
  [ItemType.FurnitureBed]: 'Somewhere for me to sleep.',
  [ItemType.FurniturePainting]: 'A lovely painting to hang on the wall.',
  [ItemType.FurnitureRugLarge]: 'A lovely rug to place on the floor.',
  [ItemType.FurnitureTable]: 'La mesa.',
  [ItemType.FurnitureLamp]: 'Lamps.',
};

export const TYPE_TO_CAN_SELL_MAP: Record<ItemType, boolean> = {
  // keys
  [ItemType.GateKey]: false,
  [ItemType.HouseKey]: false,
  [ItemType.FarmersSonBedroomKey]: false,
  [ItemType.FarmersBedroomKey]: false,

  // resources
  [ItemType.Rock]: true,
  [ItemType.Coal]: true,
  [ItemType.Copper]: true,
  [ItemType.CopperBar]: true,
  [ItemType.Iron]: true,
  [ItemType.IronBar]: true,

  // machines
  [ItemType.Sprinkler]: true,
  [ItemType.Furnace]: true,
  [ItemType.CraftingBench]: true,

  // food
  [ItemType.Bread]: true,

  //
  [ItemType.Chicken]: true,
  [ItemType.Egg]: true,
  [ItemType.WheatSeeds]: true,
  [ItemType.Wheat]: true,
  [ItemType.TomatoSeeds]: true,
  [ItemType.Tomato]: true,
  [ItemType.Hoe]: true,
  [ItemType.WateringCan]: true,
  [ItemType.Chest]: true,
  [ItemType.Axe]: true,
  [ItemType.Pickaxe]: true,
  [ItemType.Log]: true,
  [ItemType.Berry]: true,
  [ItemType.Shovel]: true,
  [ItemType.FurnitureBed]: true,
  [ItemType.FurniturePainting]: true,
  [ItemType.FurnitureRugLarge]: true,
  [ItemType.FurnitureTable]: true,
  [ItemType.FurnitureLamp]: true,
};

export const TYPE_TO_CAN_DESTROY_MAP: Record<ItemType, boolean> = {
  // keys
  [ItemType.GateKey]: false,
  [ItemType.HouseKey]: false,
  [ItemType.FarmersSonBedroomKey]: false,
  [ItemType.FarmersBedroomKey]: false,

  // resources
  [ItemType.Rock]: true,
  [ItemType.Coal]: true,
  [ItemType.Copper]: true,
  [ItemType.CopperBar]: true,
  [ItemType.Iron]: true,
  [ItemType.IronBar]: true,

  // machines
  [ItemType.Sprinkler]: true,
  [ItemType.Furnace]: true,
  [ItemType.CraftingBench]: true,

  // food
  [ItemType.Bread]: true,

  //
  [ItemType.Chicken]: true,
  [ItemType.Egg]: true,
  [ItemType.WheatSeeds]: true,
  [ItemType.Wheat]: true,
  [ItemType.TomatoSeeds]: true,
  [ItemType.Tomato]: true,
  [ItemType.Hoe]: true,
  [ItemType.WateringCan]: true,
  [ItemType.Chest]: true,
  [ItemType.Axe]: true,
  [ItemType.Pickaxe]: true,
  [ItemType.Log]: true,
  [ItemType.Berry]: true,
  [ItemType.Shovel]: true,
  [ItemType.FurnitureBed]: true,
  [ItemType.FurniturePainting]: true,
  [ItemType.FurnitureRugLarge]: true,
  [ItemType.FurnitureTable]: true,
  [ItemType.FurnitureLamp]: true,
};

export const TYPE_TO_CAN_DROP_MAP: Record<ItemType, boolean> = {
  // keys
  [ItemType.GateKey]: false,
  [ItemType.HouseKey]: false,
  [ItemType.FarmersSonBedroomKey]: false,
  [ItemType.FarmersBedroomKey]: false,

  // resources
  [ItemType.Rock]: true,
  [ItemType.Coal]: true,
  [ItemType.Copper]: true,
  [ItemType.CopperBar]: true,
  [ItemType.Iron]: true,
  [ItemType.IronBar]: true,

  // machines
  [ItemType.Sprinkler]: true,
  [ItemType.Furnace]: true,
  [ItemType.CraftingBench]: true,

  // food
  [ItemType.Bread]: true,

  //
  [ItemType.Chicken]: true,
  [ItemType.Egg]: true,
  [ItemType.WheatSeeds]: true,
  [ItemType.Wheat]: true,
  [ItemType.TomatoSeeds]: true,
  [ItemType.Tomato]: true,
  [ItemType.Hoe]: true,
  [ItemType.WateringCan]: true,
  [ItemType.Chest]: true,
  [ItemType.Axe]: true,
  [ItemType.Pickaxe]: true,
  [ItemType.Log]: true,
  [ItemType.Berry]: true,
  [ItemType.Shovel]: true,
  [ItemType.FurnitureBed]: true,
  [ItemType.FurniturePainting]: true,
  [ItemType.FurnitureRugLarge]: true,
  [ItemType.FurnitureTable]: true,
  [ItemType.FurnitureLamp]: true,
};

export const TYPE_TO_CAN_INTERACT_MAP: Record<ItemType, boolean> = {
  // keys
  [ItemType.GateKey]: false,
  [ItemType.HouseKey]: false,
  [ItemType.FarmersSonBedroomKey]: false,
  [ItemType.FarmersBedroomKey]: false,

  // resources
  [ItemType.Rock]: false,
  [ItemType.Coal]: false,
  [ItemType.Copper]: false,
  [ItemType.CopperBar]: false,
  [ItemType.Iron]: false,
  [ItemType.IronBar]: false,

  // machines
  [ItemType.Sprinkler]: false,
  [ItemType.Furnace]: false,
  [ItemType.CraftingBench]: false,

  // food
  [ItemType.Bread]: false,

  //
  [ItemType.Chicken]: false,
  [ItemType.Egg]: false,
  [ItemType.WheatSeeds]: false,
  [ItemType.Wheat]: false,
  [ItemType.TomatoSeeds]: false,
  [ItemType.Tomato]: false,
  [ItemType.Hoe]: true,
  [ItemType.WateringCan]: true,
  [ItemType.Chest]: false,
  [ItemType.Axe]: true,
  [ItemType.Pickaxe]: true,
  [ItemType.Log]: false,
  [ItemType.Berry]: false,
  [ItemType.Shovel]: true,
  [ItemType.FurnitureBed]: true,
  [ItemType.FurniturePainting]: true,
  [ItemType.FurnitureRugLarge]: false,
  [ItemType.FurnitureTable]: false,
  [ItemType.FurnitureLamp]: true,
};

export interface ItemSprite {
  tileset: string;
  x: number;
  y: number;
}

export interface Item {
  type: ItemType;
  currentStackSize: number;
}

export type ItemList = Array<Item | undefined>;

/**
 * A reusable inventory class for managing item storage with utilities
 */
export class Inventory {
  items: ItemList = [];
  rows: number;
  columns: number;

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
  }

  get size(): number {
    return this.rows * this.columns;
  }

  get hasItems(): boolean {
    return this.items.some(item => item !== undefined);
  }

  /**
   * finds the index of first slot with room in stack (ignoring empty slots), otherwise returns undefined
   * @param type
   * @returns
   */
  getFirstSlotWithRoom(type: ItemType): number | undefined {
    for (let i = 0; i < this.size; i++) {
      const item = this.items[i];

      if (item === undefined) {
        continue;
      }

      if (item.type !== type) {
        continue;
      }

      if (item.currentStackSize >= Inventory.getItemMaxStackSize(item.type)) {
        continue;
      }

      return i;
    }

    return undefined;
  }

  /**
   * finds the index of the first free slot, if none available, returns undefined
   * @returns
   */
  getFirstSlotAvailable(): number | undefined {
    for (let i = 0; i < this.size; i++) {
      if (this.items[i] === undefined) {
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

      if (item === undefined) {
        continue;
      }

      if (item.type === type) {
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
    const stackIndex = this.getFirstSlotWithRoom(type);
    if (stackIndex !== undefined) {
      const item = this.items[stackIndex];
      item.currentStackSize++;
      return item;
    }

    // blank slot
    const blankIndex = this.getFirstSlotAvailable();
    if (blankIndex !== undefined) {
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

    if (item.currentStackSize < amount) {
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
  hasItem(type: ItemType, amount: number): boolean {
    const items = this.items.filter(item => item !== undefined && item.type === type);
    const total = items.reduce((acc, curr) => acc + curr.currentStackSize, 0);

    if (total >= amount) {
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

    for (const [index, item] of this.items.entries()) {
      if (item === undefined) {
        continue;
      }

      if (item.type !== type) {
        continue;
      }

      const yetToBeRemoved = amount - removed;
      // no more to be removed, return;
      if (yetToBeRemoved === 0) {
        return true;
      }

      if (yetToBeRemoved >= item.currentStackSize) {
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

  hasRoomForItem(type: ItemType): boolean {
    if (this.getFirstSlotWithRoom(type) !== undefined) {
      return true;
    }

    return this.getFirstSlotAvailable() !== undefined;
  }

  private createItem(type: ItemType, stackSize?: number): Item {
    const maxStackSize = TYPE_TO_MAX_STACK_MAP[type] ?? DEFAULT_MAX_STACK;

    let currentStackSize = 1;
    if (stackSize !== undefined) {
      if (stackSize > maxStackSize) {
        currentStackSize = maxStackSize;
      } else {
        currentStackSize = stackSize;
      }
    }

    return {
      type,
      currentStackSize,
    };
  }

  static getItemName(type: ItemType, plural: boolean = false): string {
    return plural ? TYPE_TO_NAME_PLURAL_MAP[type] : TYPE_TO_NAME_SINGULAR_MAP[type];
  }

  static getItemDescription(type: ItemType): string {
    return TYPE_TO_DESCRIPTION_MAP[type];
  }

  static getItemRadius(type: ItemType): string {
    return TYPE_TO_RADIUS_MAP[type];
  }

  static getItemSprite(type: ItemType): ItemSprite {
    return TYPE_TO_SPRITE_MAP[type];
  }

  static getItemMaxStackSize(type: ItemType): number {
    return TYPE_TO_MAX_STACK_MAP[type];
  }

  static getItemBuyValue(type: ItemType): number {
    return TYPE_TO_BUY_VALUE_MAP[type];
  }

  static getItemSellValue(type: ItemType): number {
    return TYPE_TO_SELL_VALUE_MAP[type];
  }

  static canItemBeDestroyed(type: ItemType): boolean {
    return TYPE_TO_CAN_DESTROY_MAP[type];
  }

  static canItemBeDropped(type: ItemType): boolean {
    return TYPE_TO_CAN_DROP_MAP[type];
  }

  static canItemBeSold(type: ItemType): boolean {
    return TYPE_TO_CAN_SELL_MAP[type];
  }

  static canItemBeInteractedWith(type: ItemType): boolean {
    return TYPE_TO_CAN_INTERACT_MAP[type];
  }
}
