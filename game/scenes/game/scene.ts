import { type Client } from '@core/client';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';
import { Inventory, Item, ItemType } from '@game/models/inventory.model';
import { SCENE_GAME_MAP_SHOP } from './maps/shop/map';
import { SceneMapConstructorSignature } from '@core/model/scene-map';
import { SCENE_GAME_MAP_UNDERGROUND } from './maps/underground/map';
import { QuestName } from '@game/models/quest.model';

export interface QuestStatus {
  intro: boolean;
  complete: boolean;
}

export enum SceneFlags {
  shack_door_open = 'shack_door_open'
}

interface Globals extends SceneGlobalsBaseConfig {
  inventory: Inventory;
  hotbar: Inventory;
  hotbar_selected_index: number;
  gold: number;
  player: {
    enabled: boolean;
    movementEnabled: boolean
    actionsEnabled: boolean;
    interactEnabled: boolean;
  }
  flags: Record<SceneFlags, boolean>,
  quests: Record<QuestName, QuestStatus>;
}

export class SCENE_GAME extends Scene {
  globals: Globals = {
    ...this.globals,
    inventory: new Inventory(5, 5),
    hotbar: new Inventory(1, 5),
    hotbar_selected_index: 0,
    gold: 999,
    player: {
      enabled: true,
      movementEnabled: true,
      actionsEnabled: true,
      interactEnabled: true,
    },
    flags: {
      [SceneFlags.shack_door_open]: false
    },
    quests: {
      [QuestName.default]: {
        intro: false,
        complete: false,
      },
      [QuestName.collect_wheat]: {
        intro: false,
        complete: false,
      },
      [QuestName.break_rocks]: {
        intro: false,
        complete: false,
      },
      [QuestName.collect_logs]: {
        intro: false,
        complete: false,
      },
      [QuestName.collect_rocks]: {
        intro: false,
        complete: false,
      },
      [QuestName.plant_tree]:  {
        intro: false,
        complete: false,
      },
      [QuestName.collect_berries]:  {
        intro: false,
        complete: false,
      },
    }
  };

  constructor(client: Client) {
    super(client);

    this.globals.inventory.addToInventory(ItemType.GateKey);
    
    /*
    this.globals.inventory.addToInventory(ItemType.Hoe);
    this.globals.inventory.addToInventory(ItemType.WateringCan);
    this.globals.inventory.addToInventory(ItemType.Axe);
    this.globals.inventory.addToInventory(ItemType.Shovel);
    this.globals.inventory.addToInventory(ItemType.Pickaxe);
    this.globals.inventory.addToInventory(ItemType.Berry);
    */

    // this is for debugging, letting us launch into a specific map
    const params = new URLSearchParams(window.location.search);
    const mapParam = params.get('map');

    const MAP_MAP: Record<string, SceneMapConstructorSignature> = {
      'world': SCENE_GAME_MAP_WORLD,
      'underground': SCENE_GAME_MAP_UNDERGROUND,
      'shop': SCENE_GAME_MAP_SHOP
    }
    const map: SceneMapConstructorSignature = MAP_MAP[mapParam] ?? SCENE_GAME_MAP_WORLD;

    this.changeMap(map);
  }

  get selectedInventoryItem(): Item | undefined {
    return this.globals.inventory.items[this.globals.hotbar_selected_index];
  }

  get selectedInventoryIndex(): number {
    return this.globals.hotbar_selected_index;
  }

}
