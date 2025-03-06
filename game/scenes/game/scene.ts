import { type Client } from '@core/client';
import { SCENE_GAME_MAP_WORLD } from '@game/scenes/game/maps/world/map';
import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';
import { Inventory, type Item, type ItemList, ItemType } from '@game/models/inventory.model';
import { SCENE_GAME_MAP_FARM_HOUSE } from './maps/farm-house/map';
import { type SceneMapConstructorSignature } from '@core/model/scene-map';
import { SCENE_GAME_MAP_UNDERGROUND } from './maps/underground/map';
import { QuestName } from '@game/models/quest.model';
import { SCENE_GAME_MAP_FARM } from './maps/farm/map';
import { SCENE_GAME_MAP_HOUSE } from './maps/house/map';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { SaveFileKeys, Store } from '@game/utils/store.utils';
import { SCENE_GAME_MAP_TOWN } from './maps/town/map';
import { type Coordinate } from '@core/model/coordinate';
import { WorldTimeObject } from '@game/objects/world-time.object';
import { SCENE_GAME_MAP_TEST_PATHING_1 } from './maps/test/pathing/map.1';
import { SCENE_GAME_MAP_TEST_PATHING_2 } from './maps/test/pathing/map.2';
import { SCENE_GAME_MAP_TEST_PATHING_3 } from './maps/test/pathing/map.3';
import { hasOnNewDay } from '@game/models/components/new-day.model';
import { SCENE_GAME_MAP_CAVE } from './maps/cave/map';

export enum SavePoint {
  House = 'House',
  FarmHouse = 'FarmHouse'
}

export const SAVE_POINT_MAP: Record<SavePoint, SceneMapConstructorSignature> = {
  [SavePoint.House]: SCENE_GAME_MAP_HOUSE,
  [SavePoint.FarmHouse]: SCENE_GAME_MAP_FARM_HOUSE,
};

export const MINUTES_PER_DAY: number = 15;
export const DAY_LENGTH_IN_SECONDS: number = 60 * MINUTES_PER_DAY;
export const DAY_LENGTH_IN_MILLISECONDS: number = 1000 * DAY_LENGTH_IN_SECONDS;
export const DAYS_PER_WEEK: number = 7;
export const DAYS_PER_SEASON: number = 28;
export const SEASONS_PER_YEAR: number = 4;

export enum Day {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

export enum Season {
  Spring = 'Spring',
  Summer = 'Summer',
  Autumn = 'Autumn',
  Winter = 'Winter'
}

export interface QuestStatus {
  intro: boolean;
  complete: boolean;
}

export enum SceneFlag {
  // npc intros
  intro_default = 'intro_default', // not actually used, default for the NPC object
  intro_farmer = 'intro_farmer',
  intro_farmers_son = 'intro_farmers_son',
  intro_furniture_salesman = 'intro_furniture_salesman',
  intro_farming_salesman = 'intro_farming_salesman',
  intro_tool_salesman = 'intro_tool_salesman',
  intro_workman = 'intro_workman',
  // rest
  shack_door_open = 'shack_door_open',
  path_to_farm_cleared = 'path_to_farm_cleared',
  farm_visited = 'farm_visited',
  cave_visited = 'cave_visited',
  house_visited = 'house_visited',
  slept_in_farm_house_bed = 'slept_in_farm_house_bed'
}

export enum StoryFlag {
  default_started = 'default_started',
  default_completed = 'default_completed',
  // town
  town_rockslide_started = 'town_rockslide_started',
  town_rockslide_complete = 'town_rockslide_complete',
  // world
  world_hill_gate_started = 'world_hill_gate_started',
  world_hill_gate_completed = 'world_hill_gate_completed',
  world_hill_path_to_town_blockade_started = 'world_hill_path_to_town_blockade_started',
  world_hill_path_to_town_blockade_completed = 'world_hill_path_to_town_blockade_completed',
  world_hill_path_to_farm_blockade_started = 'world_hill_path_to_farm_blockade_started',
  world_hill_path_to_farm_blockade_completed = 'world_hill_path_to_farm_blockade_completed',
  world_farmers_house_locked_started = 'world_farmers_house_locked_started',
  world_farmers_house_locked_completed = 'world_farmers_house_locked_completed',
  world_collect_logs_started = 'world_collect_logs_started',
  world_collect_logs_completed = 'world_collect_logs_completed',
  world_collect_logs_counter = 'world_collect_logs_counter',
  world_collect_rocks_started = 'world_collect_rocks_started',
  world_collect_rocks_completed = 'world_collect_rocks_completed',
  world_collect_rocks_counter = 'world_collect_rocks_counter',
  world_collect_berries_started = 'world_collect_berries_started',
  world_collect_berries_completed = 'world_collect_berries_completed',
  world_collect_berries_berry_counter = 'world_collect_berries_berry_counter',
  world_collect_berries_watering_can = 'world_collect_berries_watering_can',
  world_plant_tree_started = 'world_plant_tree_started',
  world_plant_tree_completed = 'world_plant_tree_completed',
  // farm house
  farm_house_son_bedroom_door_locked_started = 'farm_house_son_bedroom_door_locked_started',
  farm_house_son_bedroom_door_locked_completed = 'farm_house_son_bedroom_door_locked_completed',
  farm_house_farmer_bedroom_door_locked_started = 'farm_house_farmer_bedroom_door_locked_started',
  farm_house_farmer_bedroom_door_locked_completed = 'farm_house_farmer_bedroom_door_locked_completed'
}

interface Globals extends SceneGlobalsBaseConfig {
  inventory: Inventory;
  hotbar: Inventory;
  hotbar_selected_index: number;
  gold: number;
  player: {
    enabled: boolean;
    movementEnabled: boolean;
    actionsEnabled: boolean;
    interactEnabled: boolean;
  };
  flags: Record<SceneFlag, boolean>;
  quests: Record<QuestName, QuestStatus>;
  warp: {
    position: Coordinate | null;
    target: Coordinate | null;
  };
  story_flags: Record<StoryFlag, boolean | number>;
  time: number;
  day: number;
  save_point?: SavePoint;
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
      // npc intros
      [SceneFlag.intro_default]: false,
      [SceneFlag.intro_farmer]: false,
      [SceneFlag.intro_farmers_son]: false,
      [SceneFlag.intro_furniture_salesman]: false,
      [SceneFlag.intro_farming_salesman]: false,
      [SceneFlag.intro_tool_salesman]: false,
      [SceneFlag.intro_workman]: false,
      // rest
      [SceneFlag.shack_door_open]: false,
      [SceneFlag.path_to_farm_cleared]: false,
      [SceneFlag.farm_visited]: false,
      [SceneFlag.cave_visited]: false,
      [SceneFlag.house_visited]: false,
      [SceneFlag.slept_in_farm_house_bed]: false,
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
      },
      [QuestName.get_some_sleep]: {
        intro: false,
        complete: false,
      },
    },
    warp: {
      position: null,
      target: null,
    },
    story_flags: {
      [StoryFlag.default_started]: false,
      [StoryFlag.default_completed]: false,
      // town
      [StoryFlag.town_rockslide_started]: true,
      [StoryFlag.town_rockslide_complete]: false,
      // world
      [StoryFlag.world_hill_gate_started]: true,
      [StoryFlag.world_hill_gate_completed]: false,
      [StoryFlag.world_hill_path_to_town_blockade_started]: true,
      [StoryFlag.world_hill_path_to_town_blockade_completed]: false,
      [StoryFlag.world_hill_path_to_farm_blockade_started]: true,
      [StoryFlag.world_hill_path_to_farm_blockade_completed]: false,
      [StoryFlag.world_farmers_house_locked_started]: true,
      [StoryFlag.world_farmers_house_locked_completed]: false,
      [StoryFlag.world_collect_logs_started]: false,
      [StoryFlag.world_collect_logs_completed]: false,
      [StoryFlag.world_collect_logs_counter]: 0,
      [StoryFlag.world_collect_rocks_started]: false,
      [StoryFlag.world_collect_rocks_completed]: false,
      [StoryFlag.world_collect_rocks_counter]: 0,
      [StoryFlag.world_collect_berries_started]: false,
      [StoryFlag.world_collect_berries_completed]: false,
      [StoryFlag.world_collect_berries_berry_counter]: 0,
      [StoryFlag.world_collect_berries_watering_can]: false,
      [StoryFlag.world_plant_tree_started]: true, // TODO: set to false
      [StoryFlag.world_plant_tree_completed]: false,
      // farm house
      [StoryFlag.farm_house_son_bedroom_door_locked_started]: true,
      [StoryFlag.farm_house_son_bedroom_door_locked_completed]: false,
      [StoryFlag.farm_house_farmer_bedroom_door_locked_started]: true,
      [StoryFlag.farm_house_farmer_bedroom_door_locked_completed]: false,
    },
    time: 0,
    day: 0,
    save_point: undefined,
  };

  constructor(client: Client, protected options: any = {}) {
    super(client);

    // persistent objects
    [
      new WorldTimeObject(this, { x: 0, y: 0, })
    ].forEach(object => {
      this.persistentObjects.set(object.id, object);
      this.objects.set(object.id, object);
    });

    if (CanvasConstants.SAVE_FILE_ID) {
      this.globals.quests = {
        ...this.globals.quests,
        ...Store.get<Record<QuestName, QuestStatus>>(SaveFileKeys.Quests),
      };

      this.globals.flags = {
        ...this.globals.flags,
        ...Store.get<Record<SceneFlag, boolean>>(SaveFileKeys.Flags),
      };

      this.globals.story_flags = {
        ...this.globals.story_flags,
        ...Store.get<Record<StoryFlag, boolean>>(SaveFileKeys.StoryFlags),
      };

      this.globals.inventory.items = Store.get<ItemList>(SaveFileKeys.Inventory).map(item => {
        // JSON Store doesn't have undefined, only null so it needs to be mapped
        if (item === null) {
          return undefined;
        }
        return item;
      });

      this.globals.save_point = Store.get<SavePoint>(SaveFileKeys.SavePoint);
    }

    const params = new URLSearchParams(window.location.search);

    // this is for debugging, giving us all items
    if (params.get('items')) {
      Object.keys(ItemType).forEach(key => this.globals.inventory.addToInventory(key as ItemType));
    }

    // this is for debugging, letting us launch into a specific map
    const MAP_MAP: Record<string, SceneMapConstructorSignature> = {
      world: SCENE_GAME_MAP_WORLD,
      underground: SCENE_GAME_MAP_UNDERGROUND,
      'farm-house': SCENE_GAME_MAP_FARM_HOUSE,
      farm: SCENE_GAME_MAP_FARM,
      house: SCENE_GAME_MAP_HOUSE,
      town: SCENE_GAME_MAP_TOWN,
      cave: SCENE_GAME_MAP_CAVE,
      'test/pathing/1': SCENE_GAME_MAP_TEST_PATHING_1,
      'test/pathing/2': SCENE_GAME_MAP_TEST_PATHING_2,
      'test/pathing/3': SCENE_GAME_MAP_TEST_PATHING_3,
    };
    const map: SceneMapConstructorSignature = MAP_MAP[params.get('map')] ?? options.map ?? (this.globals.save_point ? SAVE_POINT_MAP[this.globals.save_point] : SCENE_GAME_MAP_WORLD);

    this.changeMap(map);
  }

  get selectedInventoryItem(): Item | undefined {
    return this.globals.inventory.items[this.globals.hotbar_selected_index];
  }

  get selectedInventoryIndex(): number {
    return this.globals.hotbar_selected_index;
  }

  get flags(): Record<SceneFlag, boolean> {
    return this.globals.flags;
  }

  setFlag(flag: SceneFlag, value: boolean): void {
    this.flags[flag] = value;
  }

  getFlag(flag: SceneFlag): boolean {
    return this.flags[flag];
  }

  get storyFlags(): Record<StoryFlag, boolean | number> {
    return this.globals.story_flags;
  }

  setStoryFlag(flag: StoryFlag, value: boolean | number): void {
    this.storyFlags[flag] = value;
  }

  getStoryFlag(flag: StoryFlag): boolean | number {
    return this.storyFlags[flag];
  }

  newDay(): void {
    this.globals.time = 0;
    this.globals.day++;

    // run callback for current map
    // this will need to be called for other maps on entry
    this.objects.forEach(object => {
      if (hasOnNewDay(object)) {
        object.onNewDay();
      }
    });
  }

  get day(): Day {
    const index = this.globals.day % DAYS_PER_WEEK;
    switch (index) {
      case 0:
        return Day.Monday;
      case 1:
        return Day.Tuesday;
      case 2:
        return Day.Wednesday;
      case 3:
        return Day.Thursday;
      case 4:
        return Day.Friday;
      case 5:
        return Day.Saturday;
      case 6:
        return Day.Sunday;
    }
  }

  get season(): Season {
    const index = Math.floor(this.globals.day / DAYS_PER_SEASON) % SEASONS_PER_YEAR;
    switch (index) {
      case 0:
        return Season.Spring;
      case 1:
        return Season.Summer;
      case 2:
        return Season.Autumn;
      case 3:
        return Season.Winter;
    }
  }

  get year(): number {
    return Math.floor(this.globals.day / (DAYS_PER_SEASON * SEASONS_PER_YEAR)) + 1;
  }
}
