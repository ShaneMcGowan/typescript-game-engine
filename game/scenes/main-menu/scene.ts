import { type Client } from '@core/client';
import { SCENE_MAIN_MENU_MAP_MAIN_MENU } from './maps/main-menu/map';
import { Scene } from '@core/model/scene';

export class SCENE_MAIN_MENU extends Scene {
  constructor(protected client: Client) {
    super(client);
    this.changeMap(SCENE_MAIN_MENU_MAP_MAIN_MENU);
  }
}
