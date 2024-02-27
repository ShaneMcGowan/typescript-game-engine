import { Client } from '@core/client';
import { type AssetsConfig } from '@core/model/assets';
import { type SceneConstructorSignature } from '@core/model/scene';
import { MAIN_MENU_SCENE } from './scenes/main-menu/main-menu.scene';
import { CanvasConstants } from '@core/constants/canvas.constants';
import { GAME_SCENE } from './scenes/game/game.scene';

(function() {
  /**
   * Declare your canvas constants here
   */
  CanvasConstants.CANVAS_TILE_HEIGHT = 16;
  CanvasConstants.CANVAS_TILE_WIDTH = 9;
  CanvasConstants.TILE_SIZE = 16;

  /**
  * Add your scenes here, the first scene will be loaded on startup
  */
  const scenes: SceneConstructorSignature[] = [
    GAME_SCENE,
    MAIN_MENU_SCENE
  ];

  const assets: AssetsConfig = {
    images: {
      sprites: 'assets/sprites.png',
    },
    audio: {},
  };

  window.engine = new Client(
    document.getElementById('render-area'),
    scenes,
    assets
  );
})();
