import { Scene, type SceneGlobalsBaseConfig } from '@core/src/model/scene';
import { GAME_MAP } from './maps/game.map';
import { type Client } from '@core/src/client';

interface Globals extends SceneGlobalsBaseConfig {
  score: number;
  highscore: number;
}

export class GAME_SCENE extends Scene {
  globals: Globals;

  constructor(protected client: Client) {
    super(client);

    this.globals.score = 0;
    this.globals.highscore = localStorage.getItem('highscore') === null ? 0 : Number(localStorage.getItem('highscore'));

    this.changeMap(GAME_MAP);
  }
}
