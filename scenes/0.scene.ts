import { type Client } from '@core/client';
import { Scene } from '../core/model/scene';
import { SAMPLE_SCENE_0_MAP_0 } from './0/maps/0.map';

export class SAMPLE_SCENE_0 extends Scene {
  maps = [
    SAMPLE_SCENE_0_MAP_0
  ];

  constructor(protected client: Client) {
    super(client);
    this.changeMap(0); // should this be the default?
  }
}
