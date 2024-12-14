import { type Client } from '@core/client';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';
import { Inventory, Item, ItemType } from '@game/models/inventory.model';

interface Globals extends SceneGlobalsBaseConfig {
  inventory: Inventory;
  hotbar: Inventory;
  hotbar_selected_index: number;
  disable_player_inputs: boolean;
  gold: number;
}

export class SCENE_GAME extends Scene {
  globals: Globals = {
    ...this.globals,
    inventory: new Inventory(5, 5),
    hotbar: new Inventory(1, 5),
    hotbar_selected_index: 0,
    disable_player_inputs: false,
    gold: 999,
  };

  constructor(client: Client) {
    super(client);

    this.globals.inventory.addToInventory(ItemType.Hoe);
    this.globals.inventory.addToInventory(ItemType.WateringCan);
    this.globals.inventory.addToInventory(ItemType.WheatSeeds);
    this.globals.inventory.addToInventory(ItemType.ShopKey);

    this.changeMap(SCENE_GAME_MAP_WORLD);
  }

  get selectedInventoryItem(): Item | undefined {
    return this.globals.inventory.items[this.globals.hotbar_selected_index];
  }

  get selectedInventoryIndex(): number {
    return this.globals.hotbar_selected_index;
  }

}
