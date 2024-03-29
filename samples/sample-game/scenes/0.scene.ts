import { type Client } from '@core/client';
import { SAMPLE_SCENE_0_MAP_0 } from './0/maps/0.map';
import { Scene } from '@core/model/scene';

export class SAMPLE_SCENE_0 extends Scene {
  constructor(protected client: Client) {
    super(client);
    this.changeMap(SAMPLE_SCENE_0_MAP_0);
  }
}
