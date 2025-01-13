import { type Client } from '@core/client';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';
import { Inventory, Item, ItemType } from '@game/models/inventory.model';
import { SCENE_GAME_MAP_FARM_HOUSE } from './maps/farm-house/map';
import { SceneMapConstructorSignature } from '@core/model/scene-map';
import { SCENE_GAME_MAP_UNDERGROUND } from './maps/underground/map';
import { QuestName } from '@game/models/quest.model';
import { SCENE_GAME_MAP_FARM } from './maps/farm/map';
import { SCENE_GAME_MAP_HOUSE } from './maps/house/map';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { SaveFileKeys, Store } from '@game/utils/store.utils';

export interface QuestStatus {
  intro: boolean;
  complete: boolean;
}

export enum SceneFlags {
  shack_door_open = 'shack_door_open',
  path_to_farm_cleared = 'path_to_farm_cleared',
  farm_visited = 'farm_visited',
  house_visited = 'house_visited',
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
  flags: Record<SceneFlags, boolean>, // TODO: we seem to lose some sort of type safety here, consider changing this to a record in future
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
      [SceneFlags.shack_door_open]: false,
      [SceneFlags.path_to_farm_cleared]: false,
      [SceneFlags.farm_visited]: false,
      [SceneFlags.house_visited]: false
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
      [QuestName.plant_tree]: {
        intro: false,
        complete: false,
      },
      [QuestName.collect_berries]: {
        intro: false,
        complete: false,
      },
      [QuestName.clear_path_to_farm]: {
        intro: false,
        complete: false,
      }
    }
  };

  constructor(client: Client) {
    super(client);

    if(CanvasConstants.SAVE_FILE_ID){
      this.globals.quests = Store.get<Record<QuestName, QuestStatus>>(SaveFileKeys.Quests);
      this.globals.flags = Store.get<Record<SceneFlags, boolean>>(SaveFileKeys.Flags);
    }

    const params = new URLSearchParams(window.location.search);

    // this is for debugging, giving us all items
    if (params.get('items')) {
      Object.keys(ItemType).forEach(key => this.globals.inventory.addToInventory(key as ItemType));
    }

    // this is for debugging, letting us launch into a specific map
    const MAP_MAP: Record<string, SceneMapConstructorSignature> = {
      'world': SCENE_GAME_MAP_WORLD,
      'underground': SCENE_GAME_MAP_UNDERGROUND,
      'farm-house': SCENE_GAME_MAP_FARM_HOUSE,
      'farm': SCENE_GAME_MAP_FARM,
      'house': SCENE_GAME_MAP_HOUSE,
    }
    const map: SceneMapConstructorSignature = MAP_MAP[params.get('map')] ?? SCENE_GAME_MAP_WORLD;

    this.changeMap(map);
  }

  get selectedInventoryItem(): Item | undefined {
    return this.globals.inventory.items[this.globals.hotbar_selected_index];
  }

  get selectedInventoryIndex(): number {
    return this.globals.hotbar_selected_index;
  }

}
