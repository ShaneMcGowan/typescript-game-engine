import { type Client } from '@core/client';
import { SCENE_MAIN_MENU_MAP_MAIN_MENU } from './maps/main-menu/map';
import { Scene } from '@core/model/scene';

export class SCENE_MAIN_MENU extends Scene {

  click: boolean = false;

  constructor(protected client: Client, protected options: any = {}) {
    super(client, options);
    this.changeMap(SCENE_MAIN_MENU_MAP_MAIN_MENU);
  }
}
