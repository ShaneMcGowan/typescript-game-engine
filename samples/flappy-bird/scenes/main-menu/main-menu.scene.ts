import { type Client } from '@core/src/client';
import { Scene } from '@core/src/model/scene';
import { MAIN_MENU_MAP } from './maps/main-menu.map';

export class MAIN_MENU_SCENE extends Scene {
  constructor(protected client: Client) {
    super(client);
    this.changeMap(MAIN_MENU_MAP);
  }
}
