import { type Client } from '../client';
import { Scene } from '../model/scene';
import { SAMPLE_SCENE_1_MAP_0 } from './1/maps/0.map';
import { SAMPLE_SCENE_1_MAP_1 } from './1/maps/1.map';

const EVENT_TYPES: Record<string, string> = {
  TOGGLE_INVENTORY: 'TOGGLE_INVENTORY',
  INVENTORY_OPENED: 'INVENTORY_OPENED',
  INVENTORY_CLOSED: 'INVENTORY_CLOSED',
};

export class SAMPLE_SCENE_1 extends Scene {
  globals: Record<string, any> = {
    chickens_follow_player: false,
    inventory: [],
    inventory_size: 27,
    hotbar_size: 9,
    hotbar_selected_index: 0,
  };

  maps = [
    SAMPLE_SCENE_1_MAP_0,
    SAMPLE_SCENE_1_MAP_1
  ];

  eventTypes = EVENT_TYPES;

  constructor(client: Client) {
    super(client);
    this.changeMap(0); // should this be the default?
  }
}
