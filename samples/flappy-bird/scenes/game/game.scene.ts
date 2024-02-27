import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';
import { GAME_MAP } from './maps/game.map';
import { type Client } from '@core/client';

interface Globals extends SceneGlobalsBaseConfig {
  score: number;
  player: {
    gravity: number;
    acceleration: number;
  };
  pipe: {
    speed: number;
  };
}

export class GAME_SCENE extends Scene {
  maps = [
    GAME_MAP
  ];

  globals: Globals;

  constructor(protected client: Client) {
    super(client);

    this.globals.score = 0;
    this.globals.player = {
      gravity: 0,
      acceleration: 0,
    };
    this.globals.pipe = {
      speed: 0,
    };

    this.changeMap(0);
  }
}
