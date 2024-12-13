import { type Client } from '@core/client';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';
import { Inventory, Item } from '@game/models/inventory.model';

interface Globals extends SceneGlobalsBaseConfig {
  inventory: Inventory;
  inventory_size: number;
  hotbar_size: number;
  hotbar_selected_index: number;
  disable_player_inputs: boolean;
  gold: number;
}

export class SCENE_GAME extends Scene {
  globals: Globals = {
    ...this.globals,
    inventory: new Inventory(5, 5),
    /*
    [
      new InventoryItem({ type: InventoryItemType.Hoe, }),
      new InventoryItem({ type: InventoryItemType.WateringCan, }),
      new InventoryItem({ type: InventoryItemType.WheatSeeds, currentStackSize: 5, }),
      undefined,
      undefined,

      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),

      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),

      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),

      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),
      new InventoryItem({ type: InventoryItemType.Chicken, }),


      // new InventoryItemObject(this, { type: InventoryItemType.Egg, }),
      // new InventoryItemObject(this, { type: InventoryItemType.Tomato, currentStackSize: 10, }),
      // new InventoryItemObject(this, { type: InventoryItemType.Wheat, currentStackSize: 10, }),
      // new InventoryItemObject(this, { type: InventoryItemType.Chest, currentStackSize: 1, }),
    ],
    */
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

  get selectedInventoryItem(): Item | undefined {
    return this.globals.inventory.items[this.globals.hotbar_selected_index];
  }

  get selectedInventoryIndex(): number {
    return this.globals.hotbar_selected_index;
  }

}
