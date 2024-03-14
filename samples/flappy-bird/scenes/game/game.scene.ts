import { Scene, type SceneGlobalsBaseConfig } from '@core/model/scene';
import { GAME_MAP } from './maps/game.map';
import { type Client } from '@core/client';

interface Globals extends SceneGlobalsBaseConfig {
  score: number;
  highscore: number;
}

export class GAME_SCENE extends Scene {
  maps = [
    GAME_MAP
  ];

  globals: Globals;

  constructor(protected client: Client) {
    super(client);

    this.globals.score = 0;
    this.globals.highscore = localStorage.getItem('highscore') === null ? 0 : Number(localStorage.getItem('highscore'));

    this.changeMap(0);
  }
}
